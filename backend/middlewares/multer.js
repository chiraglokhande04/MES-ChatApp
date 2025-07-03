const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    // Customize folder and public_id based on file type or user
    return {
      folder: 'communication_app',
      resource_type: 'auto', // supports images, videos, raw files (pdf, docs, etc)
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`
    };
  },
});

const parser = multer({ storage });

module.exports = parser;
