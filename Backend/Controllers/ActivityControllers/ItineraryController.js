const ItineraryModel = require('../../Models/ActivityModels/Itinerary');
const preferenceTagModel = require('../../Models/ActivityModels/PreferenceTags');
const ActivityModel = require('../../Models/ActivityModels/Activity');
const { default: mongoose } = require('mongoose');
const BookingItinerary = require('../../Models/ActivityModels/BookingItinerary');
const Tourist = require('../../Models/UserModels/Tourist');
const { create } = require('lodash');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Notification = require('../../Models/UserModels/Notification'); // Import Notification model
const TourGuide = require('../../Models/UserModels/TourGuide'); // Import the TourGuide model
const { sendEmail } = require('../../utils/emailService'); // Import email service

const flagItinerary = async (req, res) => {
    const { id } = req.params;

    try {
        // Find the itinerary
        const itinerary = await ItineraryModel.findById(id);
        if (!itinerary) {
            return res.status(404).json({ message: 'Itinerary not found' });
        }

        // Check if the itinerary is already flagged
        if (itinerary.isFlagged === true) {
            return res.status(403).json({ message: 'Itinerary has already been flagged' });
        }

        // Fetch the tour guide details using `createdBy` field
        const tourGuide = await TourGuide.findById(itinerary.createdBy);
        if (!tourGuide) {
            return res.status(404).json({ message: 'Tour Guide not found' });
        }

        // Flag the itinerary
        itinerary.isFlagged = true;
        await itinerary.save();

        // Create a notification for the tour guide
        const notification = new Notification({
            user: tourGuide._id,
            role: 'TourGuide',
            type: 'event_flagged',
            message: `Your itinerary "${itinerary.name}" has been flagged as inappropriate by the admin.`,
            data: { itineraryId: itinerary._id },
        });
        await notification.save();

        // Send an email to the tour guide
        const subject = `⚠️ Itinerary Flagged Notification`;
        const message = `
            <h1>Dear ${tourGuide.username},</h1>
            <p>We regret to inform you that your itinerary "<strong>${itinerary.name}</strong>" has been flagged as inappropriate by the admin.</p>
            <p>If you believe this is a mistake or have any questions, please contact support.</p>
            <p>Thank you for your understanding.</p>
            <p>Best regards,<br>Your Admin Team</p>
        `;

        await sendEmail(tourGuide.email, subject, message);

        res.status(200).json({
            message: 'Itinerary flagged successfully, the Tour Guide notified via email, and a notification created.',
            isFlagged: true,
        });
    } catch (error) {
        console.error('Error flagging itinerary:', error);
        res.status(500).json({ message: 'Error flagging itinerary', error: error.message });
    }
};


const createItinerary = async (req, res) => {
    try {
        const {
            name,
            activities,
            timeline,
            LanguageOfTour,
            AvailableDates,
            AvailableTimes,
            accessibility,
            PickUpLocation,
            DropOffLocation,
            tags,
        } = req.body;

        const createdBy = req.user.id;
        let imageUrl;
        console.log('Received file:', req.file);

        // Ensure the file is uploaded and processed correctly
        if (req.file) {
            try {
                const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
                const result = await cloudinary.uploader.upload(base64Image, {
                    folder: 'itineraries',  // Optional: organize your images in a specific folder
                });

                imageUrl = result.secure_url;
            } catch (uploadError) {
                console.error('Cloudinary upload error:', uploadError);
                return res.status(500).json({ message: 'Failed to upload image to Cloudinary', error: uploadError.message });
            }
        }
        // Validate required fields
        if (
            !name ||
            !activities?.length ||
            !timeline?.length ||
            !LanguageOfTour?.length ||
            !AvailableDates?.length ||
            !AvailableTimes?.length ||
            !accessibility ||
            !PickUpLocation ||
            !DropOffLocation
        ) {
            return res.status(400).json({
                message:
                    'All required fields (name, activities, timeline, LanguageOfTour, AvailableDates, AvailableTimes, accessibility, PickUpLocation, DropOffLocation, image) must be provided.',
            });
        }

        // Validate activities
        const activityDocs = await ActivityModel.find({ _id: { $in: activities } });
        if (!activityDocs || activityDocs.length !== activities.length) {
            return res.status(400).json({ message: 'One or more activities not found.' });
        }

        // Calculate the total price
        const tourGuideConvenienceFee = 50;
        const totalPrice =
            activityDocs.reduce((sum, activity) => sum + activity.price, 0) + tourGuideConvenienceFee;

        // Validate tags
        const tagDocs = await preferenceTagModel.find({ _id: { $in: tags } });
        if (!tagDocs || tagDocs.length !== tags.length) {
            return res.status(400).json({ message: 'One or more tags not found.' });
        }

        // // Parse timeline
        // const parsedTimeline = timeline.map((entry) => {
        //     const [startTime, endTime] = entry.split('/');
        //     if (!startTime || !endTime) {
        //         throw new Error(`Invalid timeline format: ${entry}. Expected format: "HH:mm/HH:mm".`);
        //     }
        //     return { startTime, endTime };
        // });

        // Create the itinerary
        const itinerary = new ItineraryModel({
            name,
            activities,
            LanguageOfTour,
            totalPrice,
            AvailableDates,
            AvailableTimes,
            accessibility,
            PickUpLocation,
            DropOffLocation,
            createdBy,
            tags,
            imageUrl, // Store the uploaded image URL
            isActivated: true,
        });

        await itinerary.save();

        res.status(201).json({ message: 'Itinerary created successfully!', itinerary });
    } catch (error) {
        console.error('Error creating itinerary:', error);
        res.status(500).json({ message: 'Error creating itinerary', error: error.message });
    }
};


// Read Itineraries by tour guide ID
const readItinerary = async (req, res) => {
    const tourguideId = req.user.id;

    try {
        const itineraries = await ItineraryModel.find({ createdBy: tourguideId }).populate('tags activities createdBy BookedBy');
        if (itineraries.length === 0) {
            return res.status(404).json({ message: 'No itineraries found' });
        }
        res.status(200).json(itineraries);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching itineraries', error: error.message });
    }
};
//this method to check if the itineraries are activated and not flagged
const getAllActivatedItinerary = async (req, res) => {
    try {
        const itineraries = await ItineraryModel.find({}).populate('tags activities createdBy BookedBy');
        const activatedItineraries = itineraries.filter(itinerary => itinerary.isActivated === true && itinerary.isFlagged === false);
        if (activateItinerary.length === 0) {
            return res.status(404).json({ message: 'No itineraries found' });
        }
        res.status(200).json(activatedItineraries);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching itineraries', error: error.message });
    }
};

// Get All Itineraries
const getAllItinerary = async (req, res) => {
    try {
        const itineraries = await ItineraryModel.find({isFlagged : false, isActivated : true }).populate('tags activities createdBy BookedBy');
        if (itineraries.length === 0) {
            return res.status(404).json({ message: 'No itineraries found' });
        }
        res.status(200).json(itineraries);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching itineraries', error: error.message });
    }
};

// Update Itinerary
const updateItinerary = async (req, res) => {
    const { id } = req.params;
    const { tags, ...updateData } = req.body; // Extract tags and other update data

    try {
        // 1. Fetch the itinerary by ID
        const itinerary = await ItineraryModel.findById(id);
        if (!itinerary) {
            return res.status(404).json({ message: 'Itinerary not found' });
        }

        // 2. Check if the user is authorized to update this itinerary
        if (!itinerary.createdBy.equals(req.user.id)) {
            return res.status(403).json({ message: 'Not authorized to update this Itinerary' });
        }

        // 3. Handle tags if provided
        if (tags && tags.length > 0) {
            const tagDocs = await preferenceTagModel.find({ _id: { $in: tags } }); // Use _id instead of name
            if (!tagDocs || tagDocs.length !== tags.length) {
                return res.status(400).json({ message: 'One or more tags not found.' });
            }
            updateData.tags = tagDocs.map(tag => tag._id);
        }
        
        

        // 4. Perform the update with validated data
        const updatedItinerary = await ItineraryModel.findByIdAndUpdate(id, updateData, { new: true }).lean();

        // 5. Return a success response
        res.status(200).json({ message: 'Itinerary updated successfully', updatedItinerary });
    } catch (error) {
        // Log the error for debugging
        console.error('Error updating itinerary:', error);

        // Return an error response
        res.status(500).json({ message: 'Error updating Itinerary', error: error.message });
    }
};


// Unflag Itinerary
const unflagItinerary = async (req, res) => {
    const { id } = req.params;
    try {
        const itinerary = await ItineraryModel.findById(id);
        if (!itinerary) {
            return res.status(404).json({ message: 'Itinerary not found' });
        }
        if (itinerary.isFlagged === false) {
            return res.status(403).json({ message: 'Itinerary has already been unflagged' });
        }
        itinerary.isFlagged = false;
        await itinerary.save();
        res.status(200).json({ message: 'Itinerary unflagged successfully', isFlagged: false });
    } catch (error) {
        res.status(500).json({ message: 'Error unflagging itinerary', error: error.message });
    }
};

// Delete Itinerary
const deleteItinerary = async (req, res) => {
    const { id } = req.params;

    try {
        const itinerary = await ItineraryModel.findById(id);
        if (!itinerary) {
            return res.status(404).json({ message: 'Itinerary not found' });
        }
        if (!itinerary.createdBy.equals(req.user.id)) {
            return res.status(403).json({ message: 'Not authorized to delete this Itinerary' });
        }
        if(itinerary.BookedBy.length > 0){
            return res.status(403).json({ message: 'Itinerary has been booked by user(s) and cannot be deleted' });
        }
        await ItineraryModel.findByIdAndDelete(id);
        res.status(200).json({ message: 'Itinerary deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting Itinerary', error: error.message });
    }
};


const deleteItinerariesByTourGuideId = async (req, res) => {
    const { tourGuideId } = req.params;

    try {
        // Find all itineraries created by the tour guide with the given ID
        const itineraries = await ItineraryModel.find({ createdBy: tourGuideId });

        if (!itineraries || itineraries.length === 0) {
            return res.status(404).json({ message: 'No itineraries found for this tour guide' });
        }

        // Filter itineraries to check if any have been booked
        const bookedItineraries = itineraries.filter(itinerary => itinerary.BookedBy.length > 0);
        
        if (bookedItineraries.length > 0) {
            return res.status(403).json({ 
                message: `Cannot delete itineraries. ${bookedItineraries.length} itinerary(ies) have been booked by user(s) and cannot be deleted.` 
            });
        }

        // Delete unbooked itineraries created by the tour guide
        await ItineraryModel.deleteMany({ createdBy: tourGuideId, BookedBy: { $size: 0 } });
        
        res.status(200).json({ message: `Unbooked itineraries for tour guide ${tourGuideId} deleted successfully` });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting itineraries', error: error.message });
    }
};

const filterSortSearchItineraries = async (req, res) => {
    try {
        const {
            searchQuery,
            minPrice,
            maxPrice,
            startDate,
            endDate,
            minRating,
            language,
            tags,
            sortBy,
            order,
            accessibility
        } = req.query;

        // Initialize query object
        let query = {isFlagged : false, isActivated : true};

        // Search by name
        if (searchQuery) {
            query.name = { $regex: searchQuery, $options: 'i' };  // Case-insensitive search
        }

        // Filter by price range
        if (minPrice || maxPrice) {
            query.totalPrice = {};
            if (minPrice) query.totalPrice.$gte = parseFloat(minPrice);  // Minimum price
            if (maxPrice) query.totalPrice.$lte = parseFloat(maxPrice);  // Maximum price
        }

        // Filter by available date range
        if (startDate || endDate) {
            query.AvailableDates = {};
            if (startDate) query.AvailableDates.$gte = new Date(startDate);  // Start date
            if (endDate) query.AvailableDates.$lte = new Date(endDate);  // End date
        }

        // Filter by minimum rating (Assuming itinerary has a rating field)
        if (minRating) {
            query.ratings = { $gte: parseFloat(minRating) };
        }

        // Filter by accessibility (Exact match required)
        if (accessibility) {
            query.accessibility = accessibility;
        }

        // Use regex for partial match on tags (if you want partial matching)
        if (tags) {
                      // Split the tag names, assuming they are comma-separated
                      const tagNames = tags.split(',').map(tag => tag.trim());

                      // Find matching tag documents by their `name`
                      const matchingTags = await preferenceTagModel.find({
                          name: { $in: tagNames }
                      });
          
                      if (matchingTags.length === 0) {
                          return res.status(404).json({ message: 'No matching tags found' });
                      }
          
                      // Extract the ObjectId of each matching tag
                      const tagIds = matchingTags.map(tag => tag._id);
          
                      // Use the ObjectId in the query to find itineraries with those tags
                      query.tags = { $in: tagIds };
        }

        if(language){
            query.LanguageOfTour = { $in: [language] };
        }

        // Sorting logic
        let sortField;
        if (sortBy === 'price') {
            sortField = 'totalPrice'; // Sort by total price of itinerary
        } else if (sortBy === 'ratings') {
            sortField = 'ratings';  // Sort by rating (ensure this field exists in the schema)
        } else {
            sortField = 'totalPrice'; // Default sort by price
        }
        const sortOrder = order === 'desc' ? -1 : 1;  // Ascending or Descending order

        // Execute query with filters, search, and sort
        const itineraries = await ItineraryModel.find(query)
            .populate('tags')  // Assuming tags are populated
            .populate('createdBy')  // Populate the Tour Guide who created the itinerary
            .sort({ [sortField]: sortOrder });  // Sort by the field (price or ratings)

        // Check if any itineraries match the criteria
        if (!itineraries.length) {
            return res.status(404).json({ message: 'No itineraries found with the given criteria.' });
        }

        // Return the found itineraries
        res.status(200).json(itineraries);

    } catch (error) {
        // Handle errors and send the response
        res.status(500).json({ message: 'Error fetching itineraries', error: error.message });
    }
};

const activateItinerary = async (req, res) => {
    const { id } = req.params;
    try {
        const itinerary = await ItineraryModel.findById(id);
        if (!itinerary) {
            return res.status(404).json({ message: 'Itinerary not found' });
        }
        if (!itinerary.createdBy.equals(req.user.id)) {
            return res.status(403).json({ message: 'Not authorized to activate this Itinerary' });
        }
        if(itinerary.BookedBy !== null){
            return res.status(403).json({ message: 'Itinerary has been booked by user(s) and cannot be activated' });
        }
        itinerary.isActivated = true;
        await itinerary.save();
        res.status(200).json({ message: 'Itinerary activated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error activating Itinerary', error: error.message });
    }
};

const deactivateItinerary = async (req, res) => {
    const { id } = req.params;
    try {
        const itinerary = await ItineraryModel.findById(id);
        if (!itinerary) {
            return res.status(404).json({ message: 'Itinerary not found' });
        }
        if (!itinerary.createdBy.equals(req.user.id)) {
            return res.status(403).json({ message: 'Not authorized to deactivate this Itinerary' });
        }
        itinerary.isActivated = false;
        await itinerary.save();
        res.status(200).json({ message: 'Itinerary deactivated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deactivating Itinerary', error: error.message });
    }
};

const bookItinerary = async (req, res) => {
    const { itineraryId } = req.params;
    const { amountPaid } = req.body; // Retrieve the amountPaid from the request body
    const touristId = req.user.id; // Assuming `req.user` is set by authentication middleware

    try {
        // Find the itinerary and tourist
        const itinerary = await ItineraryModel.findById(itineraryId);
        const tourist = await Tourist.findById(touristId);

        if (!itinerary) {
            console.error(`Itinerary with ID ${itineraryId} not found`);
            return res.status(404).json({ message: 'Itinerary not found' });
        }
        if (!tourist) {
            console.error(`Tourist with ID ${touristId} not found`);
            return res.status(404).json({ message: 'Tourist not found' });
        }

        const { totalPrice } = itinerary;
        const { wallet } = tourist;

        // Check if tourist has sufficient balance
        if (wallet < amountPaid) {
            console.error(`Insufficient funds: Wallet has ${wallet}, but amount paid is ${amountPaid}`);
            return res.status(400).json({ message: 'Insufficient balance in wallet' });
        }

        // Check if amountPaid is greater than totalPrice
        if (amountPaid > totalPrice) {
            console.error(`Overpayment: Amount paid (${amountPaid}) exceeds total price (${totalPrice})`);
            return res.status(400).json({ message: 'Amount paid exceeds total price' });
        }

        // Deduct the amountPaid from wallet
        tourist.wallet -= amountPaid;
        await tourist.save();

        // Set cancellation deadline to 48 hours before the itinerary start date
        const itineraryStartDate = itinerary.AvailableDates[0];
        const cancellationDeadline = new Date(itineraryStartDate.getTime() - 48 * 60 * 60 * 1000); // 48 hours before

        // Create the booking
        const newBooking = new BookingItinerary({
            Tourist: touristId,
            Itinerary: itineraryId,
            amountPaid, // Store the amountPaid in the booking
            Status: 'Active',
            BookedAt: new Date(),
            CancellationDeadline: cancellationDeadline,
        });
        await newBooking.save();

        res.status(201).json({
            message: 'Itinerary booking successful',
            booking: newBooking,
            walletBalance: tourist.wallet,
        });
    } catch (error) {
        console.error('Error during itinerary booking:', error);
        res.status(500).json({ message: 'Error processing itinerary booking', error: error.message });
    }
};


const getItineraryById = async (req, res) => {
    try {
      const { id } = req.params;
      const itinerary = await ItineraryModel.findById(id);
  
      if (!itinerary) {
        return res.status(404).json({ message: 'Itinerary not found' });
      }
  
      res.json(itinerary);
    } catch (error) {
      console.error('Error fetching itinerary:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };

  const stripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];

    try {
        // Verify the event using the Stripe signature
        const event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const { itineraryId } = session.metadata;
            const touristId = session.client_reference_id;

            // Retrieve itinerary and tourist details
            const itinerary = await ItineraryModel.findById(itineraryId);
            const tourist = await Tourist.findById(touristId);

            if (!itinerary || !tourist) {
                console.error('Itinerary or Tourist not found during webhook processing.');
                return res.status(404).json({ message: 'Itinerary or Tourist not found' });
            }

            // Deduct payment from wallet if applicable
            if (tourist.wallet >= itinerary.totalPrice) {
                tourist.wallet -= itinerary.totalPrice;
                await tourist.save();
            }

            // Create a booking record
            const booking = new BookingItinerary({
                Tourist: touristId,
                Itinerary: itineraryId,
                Status: 'Active',
                BookedAt: new Date(),
            });

            await booking.save();

            console.log('Booking created:', booking);
        }

        res.status(200).send('Webhook received.');
    } catch (error) {
        console.error('Stripe webhook error:', error.message);
        res.status(400).send(`Webhook Error: ${error.message}`);
    }
};


const stripeSuccess = async (req, res) => {
    const { sessionId } = req.query; // Stripe session ID from the frontend

    try {
        // Retrieve the Stripe session details
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        const { itineraryId } = session.metadata; // Retrieve the itinerary ID from the session metadata
        const touristId = session.client_reference_id; // Retrieve the tourist ID from the session reference

        // Retrieve the itinerary and tourist
        const itinerary = await ItineraryModel.findById(itineraryId);
        const tourist = await Tourist.findById(touristId);

        if (!itinerary || !tourist) {
            return res.status(404).json({ message: 'Itinerary or Tourist not found' });
        }

        // Deduct wallet balance (if applicable) or confirm payment success
        const { totalPrice } = itinerary;
        if (tourist.wallet >= totalPrice) {
            tourist.wallet -= totalPrice;
            await tourist.save();
        }

        // Create a new booking
        const newBooking = new BookingItinerary({
            Tourist: touristId,
            Itinerary: itineraryId,
            Status: 'Active',
            BookedAt: new Date(),
        });

        await newBooking.save();

        res.status(201).json({
            message: 'Payment successful! Itinerary booked successfully.',
            booking: newBooking,
            walletBalance: tourist.wallet,
        });
    } catch (error) {
        console.error('Error during Stripe success processing:', error.message);
        res.status(500).json({ message: 'Error finalizing payment', error: error.message });
    }
};

  

  const createStripeSession = async (req, res) => {
      const { itineraryId } = req.params;
      const touristId = req.user.id; // Tourist ID from authentication
  
      try {
          // Find the itinerary
          const itinerary = await ItineraryModel.findById(itineraryId);
          if (!itinerary) {
              return res.status(404).json({ message: 'Itinerary not found' });
          }
  
          // Create a Stripe Checkout session
          const session = await stripe.checkout.sessions.create({
              payment_method_types: ['card'], // Accept card payments
              line_items: [
                  {
                      price_data: {
                          currency: 'usd',
                          product_data: {
                              name: itinerary.name,
                              description: `Activities Included: ${itinerary.activities.length}`,
                          },
                          unit_amount: Math.round(itinerary.totalPrice * 100), // Stripe expects the amount in cents
                      },
                      quantity: 1,
                  },
              ],
              mode: 'payment',
              client_reference_id: touristId, // Reference to the tourist ID
              metadata: {
                  itineraryId: itinerary._id.toString(), // Store itinerary ID for the webhook
              },
              success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
              cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
          });
  
          // Send the session URL to the frontend
          res.status(200).json({ url: session.url });
      } catch (error) {
          console.error('Error creating Stripe session:', error.message);
          res.status(500).json({ message: 'Error creating Stripe session', error: error.message });
      }
  };
  



module.exports = {
    bookItinerary,
    createItinerary,
    readItinerary,
    getAllItinerary,
    updateItinerary,
    deleteItinerary,
    filterSortSearchItineraries,
    activateItinerary,
    deactivateItinerary,
    getAllActivatedItinerary,
    flagItinerary,
    unflagItinerary,
    deleteItinerariesByTourGuideId,
    getItineraryById,
    createStripeSession,
    stripeSuccess,
    stripeWebhook,
};
