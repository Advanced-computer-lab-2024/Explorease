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
![App Screenshot](link_to_screenshot.png)  
*(Add more images as needed or a video showcasing the app's features)*


## Tech/Framework Used:
- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Third-party Services**: Stripe (for payments), Google Maps API, Twilio (for real-time notifications)
- **Testing**: Postman for API testing


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
The Base address for the API is : http://localhost:3000
 The provided list is of all the API routes:
-  POST /admin/createMainAdmin
-  POST /admin/add
-  POST /admin/login 
-  GET /admin/all
-  POST /admin/addGovernor
-  DELETE /admin/delete/:id
-  POST /admin/createTags
- PUT /admin/updateTag/:id
- ** GET /admin/getTags
- ** DELETE /admin/deleteTag/:id
- ** POST /admin/createPromoCode
- ** PUT /admin/updatePromoCode/:id
- ** GET /admin/getPromoCodes
- ** DELETE /admin/deletePromoCode/:id
- ** POST /admin/createCategory
- ** PUT /admin/updateCategory/:id
- ** GET /admin/getCategories
- ** DELETE /admin/deleteCategory/:id
- ** GET /admin/products
- ** GET /admin/adminproducts
- ** POST /admin/addProduct
- ** PUT /admin/archiveProduct/:id
- ** PUT /admin/updateProduct/:id
- ** DELETE /admin/deleteProduct/:id
- ** GET /admin/myproducts/filter-sort-search
- ** GET /admin/itineraries
- ** PUT /admin/flagItineraries/:id
- ** PUT /admin/unflagItineraries/:id
- ** GET /admin/activities
- ** PUT /admin/flagActivity/:id
- ** PUT /admin/unflagActivity/:id
- ** GET /admin/tourists
- ** GET /admin/sellers
- ** GET /admin/tourismGovernors
- ** GET /admin/addGoverner
- ** GET /admin/tourGuides
- ** GET /admin/advertisers
- ** DELETE /admin/deleteUser/:id/:userType
- ** PUT /admin/editMyPassword
- ** GET /admin/pending-users
- ** POST /admin/accept-user
- ** POST /admin/reject-user
- ** GET /admin/sales-report
- ** GET /admin/sales-report/filter
- ** GET /admin/getAllComplaints
- ** GET /admin/getComplaintsByStatus
- ** GET /admin/getComplaintsByDate
- ** GET /admin/adminRespondToComplaint/:complaintId
- ** DELETEPUT /admin/deleteComplaint
- ** GET /admin/getRequesteddeleteUsers
- ** POST /admin/notifications
- ** GET /admin/notifications
- ** PUT /admin/notifications/:id
- ** DELETE /admin/notifications/:id


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

