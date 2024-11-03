const Complaint = require('../../Models/UserModels/Complaint.js');



const getComplaintsByStatus=  async (req, res) => {
    try {
      const { status } = req.query;
      
      let query = {};
      
      if (status) {
        query.status = status;
      }
      
      const complaints = await Complaint.find(query)
        .sort({ date: -1 })
        .populate('touristId', 'username')
        .exec();
      
      res.status(200).json(complaints);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving complaints by status', error: error.message });
    }
  };

  const getComplaintsByDate= async (req, res) => {
    try {
      const { date } = req.query;
      
      let query = {};
      
      if (date) {
        // Convert the date string to a Date object
        const queryDate = new Date(date);
        
        // Set the time to midnight for the query date
        queryDate.setHours(0, 0, 0, 0);
        
        // Find complaints where the date field is on the same day as the query date
        query.date = {
          $gte: queryDate,
          $lt: new Date(queryDate.getTime() + 24 * 60 * 60 * 1000) // Next day
        };
      }
      
      const complaints = await Complaint.find(query)
        .sort({ date: -1 })
        .populate('touristId', 'username')
        .exec();
      
      res.status(200).json(complaints);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving complaints by date', error: error.message });
    }
  };

  const getComplaintsByTouristAndStatus= async (req, res) => {
    try {
      const touristId = req.user.id; 
      const { status } = req.params;
      
      let query = { touristId };
      
      if (status && status !== 'all') {
        query.status = status;
      }
      
      const complaints = await Complaint.find(query)
        .sort({ createdAt: -1 })
        .exec();
      
      res.status(200).json(complaints);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving complaints', error: error.message });
    }
  };


  const addComplaint = async (req, res) => {
    try {
      const { title, body } = req.body;
      const touristId = req.user.id;
  
      if (!title || !body ) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
  
      const newComplaint = new Complaint({
        title,
        body,
        touristId ,
        date: new Date(),
        CreatedAt:new Date(),
        status: 'Pending'
      });
  
      const savedComplaint = await newComplaint.save();
  
      res.status(201).json(savedComplaint);
    } catch (error) {
      res.status(500).json({ message: 'Error adding complaint', error: error.message });
    }
  };

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

  const adminRespondToComplaint= async (req, res) => {
    try {
      const { complaintId } = req.params;
      const { adminResponse } = req.body;
      const adminId = req.user.id; // Assuming the admin ID is stored in req.user.id

      if (!adminResponse) {
        return res.status(400).json({ message: 'Admin response is required' });
      }

      const updatedComplaint = await Complaint.findByIdAndUpdate(
        complaintId,
        {
          adminResponse,
          adminId,
          status: 'Responded',
          $set: { updatedAt: new Date() }
        },
        { new: true, runValidators: true }
      );

      if (!updatedComplaint) {
        return res.status(404).json({ message: 'Complaint not found' });
      }

      res.status(200).json(updatedComplaint);
    } catch (error) {
      res.status(500).json({ message: 'Error responding to complaint', error: error.message });
    }
  };

  const getAllComplaints= async (req, res) => {
      try {
        const complaints = await Complaint.find()
          .sort({ date: -1 })
          .populate('touristId', 'username')
          .exec();
        
        res.status(200).json(complaints);
      } catch (error) {
        res.status(500).json({ message: 'Error retrieving complaints', error: error.message });
      }
    };
  


module.exports = { getComplaintsByStatus,getComplaintsByDate, getComplaintsByTouristAndStatus , addComplaint ,deleteComplaint,adminRespondToComplaint,getAllComplaints };