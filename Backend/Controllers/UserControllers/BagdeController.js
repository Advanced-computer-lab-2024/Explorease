const Badge =  require('../../Models/UserModels/Badge.js');
const Loyalty =  require('../../Models/UserModels/Loyalty.js');


 const calculateAndUpdateLevel= async (req, res) => {
    try {
      const { touristId } = req.user.id;

      // Get the loyalty points for the tourist
      const loyalty = await Loyalty.findOne({ touristId });

      if (!loyalty) {
        return res.status(404).json({ message: 'Loyalty record not found for this tourist' });
      }
      
      // Calculate the level based on points
      let level;
      if (loyalty.points <= 100000) {
        level = 'explorer';
      } else if (loyalty.points <= 500000) {
        level = 'adventurer';
      } else {
        level = 'pioneer';
      }

      // Find existing badge or create a new one
      let badge = await Badge.findOne({ touristId });

      if (badge) {
        // Update existing badge if level has changed
        if (badge.level !== level) {
          badge.level = level;
          badge.awardedAt = new Date();
          await badge.save();
        }
      } else {
        // Create new badge
        badge = new Badge({
          touristId,
          level,
          awardedAt: new Date()
        });
        await badge.save();
      }

      res.status(200).json({
        message: 'Badge level calculated and updated successfully',
        badge
      });
    } catch (error) {
      res.status(500).json({ message: 'Error calculating badge level', error: error.message });
    }
  };

const  getBadgeByTouristId= async (req, res) => {
    try {
      const { touristId } = req.user.id;

      const badge = await Badge.findOne({ touristId });

      if (!badge) {
        return res.status(404).json({ message: 'Badge not found for this tourist' });
      }

      res.status(200).json(badge);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving badge', error: error.message });
    }
  };

  const getLevel = async (req, res) => {
    try {
      const { touristId } = req.user.id;
  
      const loyalty = await Loyalty.findOne({ touristId });
  
      if (!loyalty) {
        return res.status(404).json({ message: 'Loyalty record not found for this tourist' });
      }
  
      let level;
      if (loyalty.points <= 100000) {
        level = 'explorer';
      } else if (loyalty.points <= 500000) {
        level = 'adventurer';
      } else {
        level = 'pioneer';
      }
  
      res.status(200).json({ level });
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving level', error: error.message });
    }
  };



module.exports = {calculateAndUpdateLevel,getBadgeByTouristId,getLevel};