const mongoose = require('mongoose');

const SlideSchema = new mongoose.Schema({
  type: { type: String, enum: ['image', 'video'], required: true },
  url: { type: String, required: true },
  public_id: { type: String }, // Cloudinary public id (used to delete)
  animation: { type: String, default: null },
  duration: { type: Number, default: 5000 } // ms for images; ignored for video
}, { _id: false });

const StorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, index: true, default: 'General' },
  slides: [SlideSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Story', StorySchema);
