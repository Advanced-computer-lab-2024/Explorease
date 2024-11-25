const Tourist = require('../Models/UserModels/Tourist');
const { createBirthdayPromoCode } = require('../Controllers/ProductControllers/PromoCodeController');
const { sendEmail } = require('./emailService');

const generateBirthdayPromoCodes = async () => {
    try {
        const today = new Date();
        const tourists = await Tourist.find({
            dob: { $exists: true },
            $expr: {
                $and: [
                    { $eq: [{ $dayOfMonth: '$dob' }, today.getDate()] },
                    { $eq: [{ $month: '$dob' }, today.getMonth() + 1] }
                ]
            }
        });

        for (const tourist of tourists) {
            const promoCode = await createBirthdayPromoCode(tourist._id);

            // Send promo code via email
            const subject = `🎉 Happy Birthday, ${tourist.username}! 🎂`;
            const message = `
                <h1>Happy Birthday, ${tourist.username}!</h1>
                <p>We’re excited to celebrate your special day! Here’s your exclusive birthday promo code:</p>
                <h2>${promoCode.name}</h2>
                <p>Discount of : ${promoCode.percentage}%</p>
                <p>Use it to enjoy discounts on your next adventure with us.</p>
                <p>Cheers,<br>Your Travel Team</p>
            `;

            await sendEmail(tourist.email, subject, message);
        }
        console.log('Birthday promo codes generated and emails sent successfully!');
    } catch (error) {
        console.error('Error generating birthday promo codes:', error.message);
    }
};

module.exports = { generateBirthdayPromoCodes };
