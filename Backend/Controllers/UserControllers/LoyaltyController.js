const Loyalty = require('../../Models/UserModels/Loyalty.js');
const Tourist = require('../../Models/UserModels/Tourist.js');

// const convertPointsToRedeemableAmount = async (req, res) => {
//   try {
//     const { touristId } = req.user.id;
//     const { points } = req.body;

//     if (!points || points <= 0) {
//       return res.status(400).json({ message: 'Invalid number of points' });
//     }

//     // Find the loyalty record for the tourist
//     const loyalty = await Loyalty.findOne({ touristId });

//     if (!loyalty) {
//       return res.status(404).json({ message: 'Loyalty record not found for this tourist' });
//     }

//     // Check if the tourist has enough points
//     if (loyalty.points < points) {
//       return res.status(400).json({ message: 'Insufficient points' });
//     }

//     // Convert points to redeemable amount (10000 points = 100 EGP)
//     const redeemableAmount = (points / 10000) * 100;

//     // Update the loyalty record
//     loyalty.points -= points;
//     loyalty.redeemableAmount += redeemableAmount;
//     await loyalty.save();

//     // Update the tourist's loyalty points
//     const tourist = await Tourist.findById(touristId);
//     if (!tourist) {
//       return res.status(404).json({ message: 'Tourist not found' });
//     }
//     tourist.loyaltyPoints = loyalty.points;
//     tourist.wallet  = tourist.wallet + redeemableAmount;
//     await tourist.save();

//     res.status(200).json({
//       message: 'Points converted to redeemable amount successfully',
//       convertedPoints: points,
//       redeemableAmount,
//       remainingPoints: loyalty.points
//     });
//   } catch (error) {
//     console.error('Error converting points to redeemable amount:', error);
//     res.status(500).json({ message: 'Internal server error', error: error.message });
//   }
// };


// const addPoints = async (req, res) => {
//     try {
//       const { touristId } = req.user.id;
//       const { amountPaid } = req.body;
  
//       if (!amountPaid || amountPaid <= 0) {
//         return res.status(400).json({ message: 'Invalid amount paid' });
//       }
  
//       // Find the loyalty record and badge for the tourist
//       const loyalty = await Loyalty.findOne({ touristId });
//       const badge = await Badge.findOne({ touristId });
  
//       if (!loyalty || !badge) {
//         return res.status(404).json({ message: 'Loyalty or Badge record not found for this tourist' });
//       }
      
//       // Determine the points multiplier based on the badge level
//       let pointsMultiplier;
//       switch (badge.level) {
//         case 'explorer':
//           pointsMultiplier = 0.5;
//           break;
//         case 'adventurer':
//           pointsMultiplier = 1;
//           break;
//         case 'pioneer':
//           pointsMultiplier = 1.5;
//           break;
//         default:
//           pointsMultiplier = 0.5; // Default to bronze level if unknown
//       }
  
//       // Calculate points to add
//       const pointsToAdd = Math.floor(amountPaid * pointsMultiplier);
  
//       // Update the loyalty record
//       loyalty.points += pointsToAdd;
//       await loyalty.save();
  
//       // Update the tourist's loyalty points
//       const tourist = await Tourist.findById(touristId);
//       if (!tourist) {
//         return res.status(404).json({ message: 'Tourist not found' });
//       }
//       tourist.loyaltyPoints = loyalty.points;
//       await tourist.save();
  
//       // Recalculate badge level
//       let newLevel;
//       if (loyalty.points <= 100000) {
//         newLevel = 'explorer';
//       } else if (loyalty.points <= 500000) {
//         newLevel = 'adventurer';
//       } else {
//         newLevel = 'pioneer';
//       }
  
//       // Update badge if level has changed
//       if (badge.level !== newLevel) {
//         badge.level = newLevel;
//         badge.awardedAt = new Date();
//         await badge.save();
//       }
  
//       res.status(200).json({
//         message: 'Points added successfully',
//         addedPoints: pointsToAdd,
//         totalPoints: loyalty.points,
//         newBadgeLevel: newLevel
//       });
//     } catch (error) {
//       console.error('Error adding points:', error);
//       res.status(500).json({ message: 'Internal server error', error: error.message });
//     }
//   };

  const addPoints = async (req, res) => {
    try{
        const { touristId } = req.user.id;
        const { amountPaid } = req.body;
        if (!amountPaid || amountPaid <= 0) {
          return res.status(400).json({ message: 'Invalid amount paid' });
        }
        const loyalty = await Loyalty.findOne({ touristId });
        if (!loyalty) {
          return res.status(404).json({ message: 'Loyalty record not found for this tourist' });
        }
        let pointsMultiplier; // Determine the points multiplier based on the loyalty level
        switch (loyalty.level) {
          case 1:
            pointsMultiplier = 0.5;
            break;
          case 2:
            pointsMultiplier = 1;
            break;
          case 3:
            pointsMultiplier = 1.5;
            break;
          default:
            pointsMultiplier = 0.5; // Default to bronze level if unknown
        }
        if(loyalty.TotalPointsEarned > 100000 && loyalty.TotalPointsEarned <= 500000){
          loyalty.level = 2;
        }
        else if(loyalty.TotalPointsEarned > 500000){
          loyalty.level = 3;
        }

        const pointsToAdd = Math.floor(amountPaid * pointsMultiplier);
        loyalty.points += pointsToAdd;
        loyalty.TotalPointsEarned += pointsToAdd;
        await loyalty.save();
    }
    catch(error){
        console.error('Error adding points:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }

  

  const convertPointsToRedeemableAmount = async (req, res) => {
    try{
        const { touristId } = req.user.id;
        const { money } = req.body;
        if (!money || money <= 0) {
          return res.status(400).json({ message: 'Invalid amount' });
        }
        const loyalty = await Loyalty.findOne({ touristId });
        const tourist = await Tourist.findById(touristId);
        if (!loyalty) {
          return res.status(404).json({ message: 'Loyalty record not found for this tourist' });
        }
        if (!tourist) {
          return res.status(404).json({ message: 'Tourist not found' });
        }
        const moneytopoints = money * 100;
        if (loyalty.points < moneytopoints) {
          return res.status(400).json({ message: 'Insufficient points' });
        }
        loyalty.points -= moneytopoints;
        tourist.wallet += money;
        await loyalty.save();
        await tourist.save();
        res.status(200).json({
          message: 'Points converted to money successfully',
          convertedPoints: moneytopoints,
          remainingPoints: loyalty.points,
          wallet: tourist.wallet
        }); 
    }
    catch(error){
      console.error('Error converting points to redeemable amount:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }
    
  

module.exports = { convertPointsToRedeemableAmount,addPoints};