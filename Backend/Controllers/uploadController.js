const Seller = require('../Models/UserModels/Seller');
const Advertiser = require('../Models/UserModels/Advertiser');
const TourGuide = require('../Models/UserModels/TourGuide');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// PDF storage for required documents
const pdfStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'required-documents',
        resource_type: 'raw', // Allows PDFs and non-image files
        allowed_formats: ['pdf'],
    },
});

// Multer middleware for PDF upload
const uploadPDF = multer({ storage: pdfStorage });

// Helper function to save documents to user model
async function handleDocumentUpload(req, res, UserModel, requiredDocs) {
    const { email } = req.body;
    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const uploadedDocs = {};
        for (const [key, fileArray] of Object.entries(req.files)) {
            const file = fileArray[0];
            const result = await cloudinary.uploader.upload(file.path, {
                folder: 'required-documents',
                resource_type: 'raw',
                public_id: `${file.originalname.split('.')[0]}`, // Optional: set public ID based on the original filename
                type: 'upload'
            });
            uploadedDocs[key] = result.secure_url;
        }

        // Save uploaded document URLs to the user's model
        user.documents = { ...user.documents, ...uploadedDocs };
        await user.save();
        res.status(200).json({ message: 'Documents uploaded successfully', documents: user.documents });
    } catch (error) {
        console.error('Error uploading documents:', error);
        res.status(500).json({ message: 'Error uploading documents', error: error.message });
    }
}

// Upload controller for each user type
const uploadSellerDocuments = (req, res) => handleDocumentUpload(req, res, Seller, ['ID', 'TaxationRegistry']);
const uploadAdvertiserDocuments = (req, res) => handleDocumentUpload(req, res, Advertiser, ['ID', 'TaxationRegistry']);
const uploadTourGuideDocuments = (req, res) => handleDocumentUpload(req, res, TourGuide, ['ID', 'Certificates']);

module.exports = {
    uploadPDF,
    uploadSellerDocuments,
    uploadAdvertiserDocuments,
    uploadTourGuideDocuments,
};

