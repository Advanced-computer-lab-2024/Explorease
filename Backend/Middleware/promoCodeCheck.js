const PromoCode = require('../../Models/ProductModels/PromoCode'); // Assuming you have a PromoCode model

const validatePromoCode = async (promoCode, userId, cartItems) => {
    try {
        // Find the promo code in the database
        const promo = await PromoCode.findOne({ code: promoCode });
        if (!promo) {
            throw new Error('Invalid promo code');
        }

        // Check if the promo code is expired
        if (new Date() > promo.expiryDate) {
            throw new Error('Promo code has expired');
        }

        // Check if the promo code has usage restrictions
        if (promo.maxUses !== undefined && promo.uses >= promo.maxUses) {
            throw new Error('Promo code has reached its maximum usage');
        }

        // Check if the user is eligible for the promo code
        if (promo.assignedTo && !promo.assignedTo.includes(userId)) {
            throw new Error('You are not eligible to use this promo code');
        }

        // Check if the promo code applies to the cart items
        const applicableItems = cartItems.filter(item =>
            promo.applicableProducts.includes(item.productId.toString())
        );
        if (applicableItems.length === 0) {
            throw new Error('Promo code does not apply to any items in your cart');
        }

        return { isValid: true, discount: promo.discount };
    } catch (error) {
        return { isValid: false, message: error.message };
    }
};
 
module.exports = validatePromoCode;