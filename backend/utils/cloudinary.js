const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: 'dbwoz1r0f',
  api_key: '792243148413632',
  api_secret: '1MSZY_ubSw4V5lbd15yKltUSfLw'
});

// ✅ FIX: Required for multi-file upload
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const resource_type = file.mimetype.startsWith("video") ? "video" : "image";

    return {
      folder: `webstories/${resource_type === "video" ? "videos" : "images"}`,
      resource_type,
      format: resource_type === "video" ? "mp4" : undefined,

      // ✅ UNIQUE PUBLIC ID
      public_id: `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`,
    };
  },
});

// ✅ parser for multiple files
const parser = multer({ storage });

module.exports = { cloudinary, parser };
