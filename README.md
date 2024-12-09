# Explorease - Virtual Trip Planner website



## Motivation:
We created Explorease to simplify the process of planning a trip, from booking transportation, and hotels to finding local activities, and purchasing goods. It brings together all your vacation planning needs in one platform, tailored to your personal preferences.


## Build Status:
**Build Completed**: The project is in **Stable Release**.
- ✅ **Build Completed**: The project is functional and deployed.  
- ⚠️ **Known Issues**:  
  - **Performance**: The site may experience some slowness.  
  - **Photo Rendering**: Images may not render consistently under certain network conditions.  

We are actively working to address these issues in future updates.


## Code Style:
- Camel case naming convention used.
- Consistent clear comments that makes the code easy to understand.
- Clear structure, and separation of concerns that can be easily maintained and updated.


## Screenshots:
![App Screenshot](https://github.com/Advanced-computer-lab-2024/Explorease/blob/main/landing%20page.png)  

![App Screenshot](https://github.com/Advanced-computer-lab-2024/Explorease/blob/main/Screenshot%202024-12-08%20212657.png)  

![App Screenshot](https://github.com/Advanced-computer-lab-2024/Explorease/blob/main/tourist%20homepage.png)  

![App Screenshot](https://github.com/Advanced-computer-lab-2024/Explorease/blob/main/past%20activity%20bookings.png)  

![App Screenshot](https://github.com/Advanced-computer-lab-2024/Explorease/blob/main/book%20itinerary.png)  

![App Screenshot](https://github.com/Advanced-computer-lab-2024/Explorease/blob/main/purchased%20products.png)  

[![Watch the video](https://github.com/Advanced-computer-lab-2024/Explorease/blob/main/Explorease.mp4)]

*(Add more images as needed or a video showcasing the app's features)*


## Tech/Framework Used:
- *Frontend*: React.js
- *Backend*: Node.js, Express.js
- *Database*: MongoDB
- *Authentication*: JWT (JSON Web Tokens), and bcrypt (for hashing passwords)
- *Third-party Services*: Stripe (for payments), Google Maps API, ExchangeRates, Cloudinary, Amadeus, and Mailgun.
- *Testing*: Postman for API testing


## Features:
- **Personalized Travel Planning**: Customizable vacation preferences like historic sites, beaches, and more.
- **Seamless Booking**: Direct flight, and hotel booking without redirects.
- **Transit Route Planner**: Plan your transit routes effortlessly using Google Maps integration, ensuring you get the best and most efficient route to your desired destination.  
- **Smart Budgeting**: Activity suggestions based on your available budget.
- **Discover Local Gems**: Curated local activities, itineraries, and historical landmarks with ticket prices and directions.
- **Real-Time Notifications**: Instant updates on upcoming events and activities.
- **Tour Guides and Itineraries**: Expert-guided tours.
- **Exclusive Marketplace**: Souvenirs and unique local items on the website.
- **Loyalty Rewards**: Earn loyalty points for every transaction, which can be redeemed for discounts or special offers.  
- **Ratings and Feedback**: Rate and review your experiences, such as items purchased or tours completed. Provide feedback for continuous improvement and file complaints when necessary.  
- **Wishlist and Saved Events**: Save and remember your favorite activities, itineraries, and items, so you can easily revisit them later at your convenience.  


## Code Examples:
1. Tourist login:

const loginTourist = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = createToken(user);  // Token creation
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
};

2. Sort itineraries and activities by rating:

const sortAllByRating = async (req, res) => {
    try {
        const itineraries = await sortItineraryByRating();
        const activities = await sortActivityByRating();

        // Combine both arrays and sort by rating
        const combined = [...itineraries, ...activities].sort((a, b) => b.rating - a.rating);

        res.status(200).json(combined);
    } catch (err) {
        console.error("Error combining and sorting itineraries and activities by rating:", err);
        res.status(500).json({ error: "Failed to fetch and sort data." });
    }
};

3. Create a new seller:

const createSeller = async (req, res) => {
    const { username, email, password, name, description } = req.body;

    try {
        const hashedPassword = await hashPassword(password);
        const seller = await userModel.create({
            username,
            email,
            password: hashedPassword,
            name,
            description
        });

        res.status(201).json({ seller });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

4. Delete a tour guide by ID:

const deleteTourGuide = async (req, res) => {
    try {
        const tourguide = await userModel.findByIdAndDelete(req.user.id);
        res.status(200).json({ message: 'Tour guide deleted', tourguide });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

5. Get all tourists:

const getAllTourists = async (req, res) => {
    try {
        const tourists = await userModel.find({}).sort({ createdAt: -1 });
        if (tourists.length === 0) {
            return res.status(404).json({ message: 'No tourists found' });
        }
        res.status(200).json({ tourists });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


6. Update seller's password:

const updatePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    try {
        const user = await userModel.findById(req.user.id);

        if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

7. Send OTP for Forgot Password:

exports.sendOTP = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required.' });
    }

    try {
        const userModels = [Tourist, TourGuide, Seller, Advertiser, Admin, TouristGovernor];
        let user = null;

        for (const model of userModels) {
            user = await model.findOne({ email });
            if (user) break;
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found with the provided email.' });
        }

        const otp = crypto.randomInt(100000, 999999).toString();
        otpStorage[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 };

        const mailOptions = {
            from: process.env.MAILGUN_SENDER, // Mailgun sender
            to: email,
            subject: 'Password Reset OTP',
            text: Your OTP for password reset is: ${otp}\n\nThis OTP is valid for 5 minutes.,
        };

        // Send email using Mailgun
        await mg.messages().send(mailOptions);

        res.status(200).json({ message: 'OTP sent successfully to your email.' });
    } catch (error) {
        console.error('Error sending OTP:', error.message);
        res.status(500).json({ message: 'Failed to send OTP. Please try again later.', error: error.message });
    }
};

8. Add delivey address for tourist:

const addDeliveryAddress = async (req, res) => {
    const { label, address, city, zipCode, country } = req.body;
    const touristId = req.user.id;

    try {
        const tourist = await userModel.findById(touristId);
        if (!tourist) return res.status(404).json({ message: 'Tourist not found' });

        const newAddress = { label, address, city, zipCode, country };
        tourist.deliveryAddresses.push(newAddress);

        await tourist.save();
        res.status(200).json({ message: 'Address added successfully', addresses: tourist.deliveryAddresses });
    } catch (error) {
        res.status(500).json({ message: 'Error adding address', error: error.message });
    }
};

9. Create purchase for user:

const createPurchase = async (req, res) => {
    const { productId, quantity } = req.body;
    const buyerId = req.user.id;

    try {
        // Check if the product exists and has sufficient stock
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        console.log('AvailableQuantity before purchase:', product.AvailableQuantity);
        console.log('Sales before purchase:', product.Sales);

        if (product.AvailableQuantity < quantity) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }

        // Update AvailableQuantity and Sales
        product.AvailableQuantity -= quantity;
        product.Sales += quantity;

        // Save the updated product and log the result
        await product.save();
        console.log('AvailableQuantity after purchase:', product.AvailableQuantity);
        console.log('Sales after purchase:', product.Sales);

        // Create new purchase
        const purchase = new Purchase({
            productId,
            buyerId,
            quantity,
            totalPrice: product.Price * quantity,
        });

        await purchase.save();

        res.status(201).json({ message: 'Purchase successful', purchase });
    } catch (error) {
        console.error('Error processing purchase:', error);
        res.status(500).json({ message: 'Error processing purchase', error: error.message });
    }
};

10. Create product by seller:

const createProduct = async (req, res) => {
    const { Name, Price, Description, AvailableQuantity } = req.body;
    const Seller = req.user.id;
    let imageUrl;

    try {
        // If an image file is provided, upload it to Cloudinary
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'products',  // Optional: organize your images in folders
            });
            imageUrl = result.secure_url;  // Store the image URL
        }

        // Validate that required fields are provided
        if (!Name || !Price || !Description || !AvailableQuantity || !imageUrl) {
            return res.status(400).json({ message: 'All fields (Name, Price, Description, AvailableQuantity, Image) are required.' });
        }

        const product = new productModel({
            Name,
            Price,
            Description,
            Seller,
            AvailableQuantity,
            imageUrl  // Save the image URL
        });

        await product.save();
        res.status(201).json({ message: 'Product created successfully', product });
    } catch (error) {
        res.status(500).json({ message: 'Error creating product', error: error.message });
    }
};

11. Add product to cart by tourist:

const addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    const touristId = req.user.id; // Assuming authentication middleware provides the tourist's ID

    try {
        // Check if the product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Find or create the cart
        let cart = await Cart.findOne({ touristId });
        if (!cart) {
            cart = new Cart({ touristId, items: [] });
        }

        // Check if product is already in the cart
        const existingItem = cart.items.find(item => item.productId.toString() === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ productId, quantity });
        }

        cart.updatedAt = Date.now();
        await cart.save();

        res.status(200).json({ message: 'Product added to cart', cart });
    } catch (error) {
        res.status(500).json({ message: 'Error adding to cart', error: error.message });
    }
};

12. Add a new review and rating by tourist:

const addReview = async (req, res) => {
    const { tourGuideId, rating, review } = req.body;
    const touristId = req.user.id;

    try {
        const newReview = new Review({
            touristId,
            tourGuideId,
            rating,
            review
        });

        await newReview.save();
        res.status(201).json({ message: 'Review added successfully', review: newReview });
    } catch (error) {
        res.status(500).json({ message: 'Error adding review', error: error.message });
    }
};

13. Delete complaint:

const deleteComplaint = async (req, res) => {
    try {
      const { complaintId } = req.params;
  
      const deletedComplaint = await Complaint.findByIdAndDelete(complaintId);
  
      if (!deletedComplaint) {
        return res.status(404).json({ message: 'Complaint not found' });
      }
  
      res.status(200).json({ message: 'Complaint deleted successfully', deletedComplaint });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting complaint', error: error.message });
    }
  };

  14.Booking a flight with wallet:

const bookFlightWithWallet = async (req, res) => {
    const { flightId, amount } = req.body;

    try {
        // Ensure the user is authenticated
        const user = await Tourist.findById(req.user.id); // Use your authentication middleware to populate req.user

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if user has enough balance
        if (user.wallet < amount) {
            return res.status(400).json({ error: 'Insufficient wallet balance' });
        }

        // Deduct amount from the user's wallet
        user.wallet -= amount;

        // Save the updated user wallet balance
        await user.save();

        // Create a booking record in your database (adjust based on your model schema)
        // Example:
        const booking = {
            userId: user._id,
            flightId,
            amount,
            paymentMethod: 'wallet',
            status: 'confirmed',
        };
        // Save booking in DB (create a schema/model for bookings if needed)

        return res.status(200).json({
            message: 'Booking successful! Wallet balance updated.',
            walletBalance: user.wallet,
        });
    } catch (error) {
        console.error('Error processing wallet booking:', error);
        return res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
};

  15.// Unified search, filter by price, and sort products:

const getFilteredSortedProducts = async (req, res) => {
    const { name, minPrice, maxPrice, sortByRatings } = req.query;

    try {
        // Create the filter object
        let filter = {};

        filter.AvailableQuantity.$gte = 0;
        // If a name is provided, add it to the filter with a case-insensitive regex
        if (name) {
            filter.Name = { $regex: name, $options: 'i' }; // Case-insensitive regex for partial matches
        }

        // If price filtering is provided, add the price range to the filter
        if (minPrice || maxPrice) {
            filter.Price = {};
            if (minPrice) filter.Price.$gte = parseFloat(minPrice); // Greater than or equal to minPrice
            if (maxPrice) filter.Price.$lte = parseFloat(maxPrice); // Less than or equal to maxPrice
        }

        // Initialize sorting object
        let sortOption = {};

        // If sorting by ratings is requested, add it to the sort option
        if (sortByRatings) {
            sortOption.Ratings = sortByRatings === 'desc' ? -1 : 1; // Sort ratings in descending or ascending order
        }

        // Fetch products based on the filter and sorting criteria
        const products = await productModel.find(filter).sort(sortOption);

        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found.' });
        }

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
};

## Installation:
- **[VS Code](https://code.visualstudio.com/download)**: Choose the version that suits your operating system.  
- **[Node.js](https://nodejs.org)**: Choose the version that suits your operating system.  
- **[Nodemon](https://www.npmjs.com/)**: Search for the package on npm and install it.  
- **[Express](https://www.npmjs.com/)**: Search for the package on npm and install it.  
- **[Mongoose](https://www.npmjs.com/)**: Search for the package on npm and install it.  
- **[React](https://www.npmjs.com/)**: Search for the package on npm and install it.  
- **[Git](https://www.npmjs.com/)**: Search for the package on npm and install it.  
- **[Axios](https://www.npmjs.com/)**: Search for the package on npm and install it.  
- **[Postman](https://www.postman.com/downloads/)**: Choose the version that suits your operating system.  
- **[MongoDB (Atlas)](https://www.mongodb.com/atlas/database)**.


## API Refrences:
The Base address for the API is : http://localhost:5000  
The provided list is of all the API routes:

ADMIN API Routes:
-  POST /admin/createMainAdmin
-  POST /admin/add
-  POST /admin/login 
-  GET /admin/all
-  POST /admin/addGovernor
-  DELETE /admin/delete/:id
-  POST /admin/createTags
-  PUT /admin/updateTag/:id
-  GET /admin/getTags
-  DELETE /admin/deleteTag/:id
-  POST /admin/createPromoCode
-  PUT /admin/updatePromoCode/:id
-  GET /admin/getPromoCodes
-  DELETE /admin/deletePromoCode/:id
-  POST /admin/createCategory
-  PUT /admin/updateCategory/:id
-  GET /admin/getCategories
-  DELETE /admin/deleteCategory/:id
-  GET /admin/products
-  GET /admin/adminproducts
-  POST /admin/addProduct
-  PUT /admin/archiveProduct/:id
-  PUT /admin/updateProduct/:id
-  DELETE /admin/deleteProduct/:id
-  GET /admin/myproducts/filter-sort-search
-  GET /admin/itineraries
-  PUT /admin/flagItineraries/:id
-  PUT /admin/unflagItineraries/:id
-  GET /admin/activities
-  PUT /admin/flagActivity/:id
-  PUT /admin/unflagActivity/:id
-  GET /admin/tourists
-  GET /admin/sellers
-  GET /admin/tourismGovernors
-  GET /admin/addGoverner
-  GET /admin/tourGuides
-  GET /admin/advertisers
-  DELETE /admin/deleteUser/:id/:userType
-  PUT /admin/editMyPassword
-  GET /admin/pending-users
-  POST /admin/accept-user
-  POST /admin/reject-user
-  GET /admin/sales-report
-  GET /admin/sales-report/filter
-  GET /admin/getAllComplaints
-  GET /admin/getComplaintsByStatus
-  GET /admin/getComplaintsByDate
-  GET /admin/adminRespondToComplaint/:complaintId
-  DELETEPUT /admin/deleteComplaint
-  GET /admin/getRequesteddeleteUsers
-  POST /admin/notifications
-  GET /admin/notifications
-  PUT /admin/notifications/:id
-  DELETE /admin/notifications/:id
<details>
<summary>ADVERTISER API Routes:</summary>
- GET /advertiser/myProfile
- PUT /advertiser/updateProfile
- DELETE /advertiser/deleteProfile
- PUT /advertiser/editPassword
- PUT /advertiser/deleteRequest
- POST /advertiser/createActivity
- GET /advertiser/getMyActivities
- GET /advertiser/filter-sort-search
- DELETE /advertiser/deleteActivity/:id
- DELETE /advertiser/deleteActivity2/:id
- PUT /advertiser/updateActivity/:id
- POST /advertiser/upload-photo
- POST /advertiser/notifications
- GET /advertiser/notifications
- PUT /advertiser/notifications/:id
- DELETE /advertiser/notifications/:id
- GET /advertiser/salesReport
- GET /advertiser/salesReport/filter
- GET /advertiser/activity-summary
</details>
GOVERNOR API Routes
- POST /governor/createHistoricalPlace
- PUT /governor/updateHistoricalPlace/:id
- GET /governor/getMyHistoricalPlaces
- GET /governor/getAllHistoricalPlaces
- DELETE /governor/deleteHistoricalPlace/:id
- POST /governor/createTag
- GET /governor/myProfile
- PUT /governor/updateProfile
- DELETE /governor/deleteProfile
- PUT /governor/editPassword
- POST /governor/notifications
- GET /governor/notifications
- PUT /governor/notifications/:id
- DELETE /governor/notifications/:id

SELLER API Routes
- GET /seller/myProfile
- PUT /seller/myProfile
- POST /seller/createProduct
- GET /seller/myproducts
- GET /seller/products
- GET /seller/myproducts/filter-sort-search
- DELETE /seller/productsBySeller/:id
- PUT /seller/updateProduct/:id
- DELETE /seller/deleteProduct/:id
- PUT /seller/archiveProduct/:id
- PUT /seller/editPassword
- GET /seller/getall
- PUT /seller/deleteSellerRequest
- POST /seller/upload-photo
- POST /seller/notifications
- GET /seller/notifications
- PUT /seller/notifications/:id
- DELETE /seller/notifications/:id
- GET /seller/salesReport
- GET /seller/salesReport/filter

TOURGUIDE API Routes
- GET /tourguide/allActivities
- GET /tourguide/allTags
- GET /tourguide/myItineraries
- GET /tourguide/allItineraries
- PUT /tourguide/updateItinerary/:id
- PUT /tourguide/activateItinerary/:id
- PUT /tourguide/deactivateItinerary/:id
- DELETE /tourguide/deleteItinerary/:id
- DELETE /tourguide/deleteItinerary2/:id
- GET /tourguide/myProfile
- PUT /tourguide/updateProfile
- POST /tourguide/upload-photo
- POST /tourguide/createItinerary
- PUT /tourguide/editPassword
- GET /tourguide/getall
- PUT /tourguide/deletetourGuideRequest
- POST /tourguide/notifications
- GET /tourguide/notifications
- PUT /tourguide/notifications/:id
- DELETE /tourguide/notifications/:id
- GET /tourguide/salesReport
- GET /tourguide/salesReport/filter
- GET /tourguide/itinerary-summary

TOURIST API Routes
- GET /tourist/myProfile
- PUT /tourist/myProfile
- GET /tourist/products
- GET /tourist/products/filter-sort-search
- GET /tourist/promocode/:name
- POST /tourist/promocode
- POST /tourist/product/purchase
- PUT /tourist/purchase/:purchaseId/review
- GET /tourist/purchases/my-purchases
- DELETE /tourist/purchases/:purchaseId/cancel
- POST /tourist/cart/add
- GET /tourist/cart
- DELETE /tourist/cart/:productId
- DELETE /tourist/cart
- POST /tourist/cart/checkout
- PUT /tourist/cart/update
- POST /tourist/cart/apply-promo
- GET /tourist/activities
- GET /tourist/itineraries
- GET /tourist/historical-places
- GET /tourist/activities/filter-sort-search
- GET /tourist/itineraries/filter-sort-search
- GET /tourist/historical-places/filter-sort-search
- PUT /tourist/editPassword
- POST /tourist/addComplaint
- GET /tourist/getComplaintsByTouristAndStatus
- GET /tourist/getComplaintsByTourist
- DELETE /tourist/deleteComplaint
- POST /tourist/activities/book/:activityId
- POST /tourist/itineraries/book/:itineraryId
- GET /tourist/itineraries/bookings
- GET /tourist/activities/bookings
- GET /tourist/activities/:id
- POST /tourist/bookings/cancelBooking/:bookingId
- POST /tourist/bookings/cancelBookingItinerary/:bookingId
- POST /tourist/activity-bookings/add-rating/:bookingId
- POST /tourist/activity-bookings/add-comment/:bookingId
- POST /tourist/itinerary-bookings/add-rating/:bookingId
- POST /tourist/itinerary-bookings/add-comment/:bookingId
- GET /tourist/itineraries/:id
- GET /tourist/get-my-guides/:id
- GET /tourist/myPoints
- POST /tourist/addpoints
- POST /tourist/convertPointsToRedeemableAmount
- GET /tourist/myBadge
- PUT /tourist/deleteTouristRequest
- POST /tourist/subscribeToActivity/:activityId
- POST /tourist/tourguideRev/add
- GET /tourist/getTGRevAll/:tourGuideId
- GET /tourist/getTGRev/:tourGuideId
- POST /tourist/wishlist/add
- GET /tourist/wishlist
- DELETE /tourist/wishlist/:productId
- POST /tourist/delivery-address
- GET /tourist/delivery-address
- DELETE /tourist/delivery-address/:addressId
- GET /tourist/notifications
- POST /tourist/cart/stripe-session
- POST /tourist/cart/stripe-success
- POST /tourist/saved-activity/:activityId
- GET /tourist/saved-activity
- DELETE /tourist/saved-activity/:activityId
- POST /tourist/save/:itineraryId
- GET /tourist/saved-itineraries
- DELETE /tourist/saved-itineraries/:itineraryId
- POST /tourist/activities/stripe-session
- POST /tourist/activities/stripe-success
- POST /tourist/itineraries/stripe-session
- POST /tourist/itineraries/stripe-success
- POST /tourist/flights/stripe-session
- POST /tourist/hotels/stripe-session
- GET /tourist/activities/booked/booked-activities
- GET /tourist/itineraries/booked/booked-itineraries

HOTELS API Routes
- GET /hotel/search

FLIGHTS API Routes
- Get /flights/iata-code
- Get /flights/search

## Tests:
-in Postman
-
-


## How to use:
1. Clone the repository on VS code (using this comand): git clone https://github.com/Advanced-computer-lab-2024/Explorease.git
2. Set up environment variables (Create a .env file in the root directory (Backend folder) and add the following): 
MONGO_URI="mongodb+srv://peteradelmakram:123456Peter@mernapp.qmjr7.mongodb.net/?retryWrites=true&w=majority&appName=MERNApp"
JWT_SECRET=mySuperSecretKey1234
CLOUDINARY_CLOUD_NAME=dglhvla5v
CLOUDINARY_API_KEY=877731735338471
CLOUDINARY_API_SECRET=WXRXDhSbvdlX7_6fCGMiwiTT568
AMADEUS_API_KEY=Gd4Wnrdgz2Nlowi8wUQ9oDNRDB5bi1Hb
AMADEUS_API_SECRET=3EFvncvOtpjvoztM
API_TOKEN = 'dbff005947c84451a8e8f71e5254d8b3';
PARTNER_ID = '585688';
GOOGLE_API = AIzaSyDUP5fw3jw8bvJ7yj9OskV5wdm5sNUbII4
STRIPE_SECRET_KEY=sk_test_51QOJUXJQW7K2cQRDikcIoUMV9TZhm5dWsUhXveSaHbAmY2Y8S6pqTwC4UvG2JcqH9sRmAEQWI8xFLOTgTBMJ5svx00sgaAWP8T
STRIPE_PUBLISHABLE_KEY=pk_test_51QOJUXJQW7K2cQRDilsJEyTVcgbhVUvgMEnXR8EdY4jsZl4M9MoUuyU8CdRygYSYXbrLrpQpcqkDkhM9iDBNtdvj00dsrJLL50
FRONTEND_URL=http://localhost:3000  # Your frontend URL
FAILSAFECODE = NGD7KNYZ5Q79XHRD7PGKT4UZ
MAILGUN_API_KEY = d2e64ad18dfb270fb004c8e2664265d8-c02fd0ba-489278df
MAILGUN_DOMAIN=sandboxb1e282bce15c48b6a0eba45b8ef55bf2.mailgun.org
MAILGUN_SENDER=postmaster@sandboxb1e282bce15c48b6a0eba45b8ef55bf2.mailgun.org
3. Install dependencies and run the application (open 2 separate terminals):
   1. Backend: cd Backend, then npm i, then Node App.js
   2. Frontend: cd frontend, then npm i, then npm start
4. Or open [http://localhost:3000](http://localhost:3000) to view it in your browser.   
5. Register to make an account on the website, and naviagte easily after.



## **Contribute**

We welcome contributions to **Explorease**! If you have ideas, suggestions, or fixes (other than the ones mentioned in the build status) that can improve this project, feel free to contribute. Here's how you can get involved:

### **How to Contribute**
1. **Fork the Repository**:  
   - Click the "Fork" button at the top right of this repository to create a copy in your GitHub account.

2. **Clone Your Fork**:  
   - Clone your fork to your local machine using the following command:  
     ```bash
     git clone https://github.com/your-username/explorease.git
     ```

3. **Create a New Branch**:  
   - Create a branch for your changes:  
     ```bash
     git checkout -b feature/your-feature-name
     ```

4. **Implement Your Changes**:  
   - Focus on addressing the following key improvements:  
     - **Increase the Speed**: Work on optimizing the code or assets to make the site faster and reduce load times.  
     - **Ensure Pictures Render Properly**: Identify and resolve any issues preventing consistent rendering of photos.  

5. **Test Your Changes**:  
   - Thoroughly test your changes to ensure all features work as expected.  
   - Confirm the speed improvements and proper rendering of pictures on multiple browsers and devices.

6. **Commit Your Changes**:  
   - Commit your changes with a descriptive message:  
     ```bash
     git commit -m "Fix: Improve site speed and photo rendering consistency"
     ```

7. **Push to GitHub**:  
   - Push your changes to your forked repository:  
     ```bash
     git push origin feature/your-feature-name
     ```

8. **Create a Pull Request**:  
   - Go to the original repository and click on the "New Pull Request" button.  
   - Provide a clear and detailed explanation of your changes in the pull request description.

### **Guidelines**
- Please ensure your code follows the project's **coding standards**.
- Keep your commits small and focused.
- Reference any related issue numbers in your pull request.

### **Need Help?**
If you have any questions or need help with your contributions, feel free to open an issue in the repository. We'll be happy to guide you through the process!

Thank you for considering contributing to **Explorease**! 


## Credits:
https://www.youtube.com/watch?v=98BzS5Oz5E4&list=PL4cUxeGkcC9iJ_KkrkBZWZRHVwnzLIoUE
https://www.youtube.com/playlist?list=PLZlA0Gpn_vH8EtggFGERCwMY5u5hOjf-h
https://youtube.com/playlist?list=PLZlA0Gpn_vH_NT5zPVp18nGe_W9LqBDQK&si=rKWWZ_L0XKAY2gB4
https://youtu.be/CLG0ha_a0q8?si=8MRpffz2zzH7RmoU


## License:
- MIT License
- Apache-2.0 License
- ISC License
- BSD 3-Clause License
- SSPL (for MongoDB)
- Custom Terms: Google Maps API, ExchangeRates, Amadeus, and Mailgun

