const express = require('express');
const router = express.Router();
const Story = require('../models/Story');
const { parser, cloudinary } = require('../utils/cloudinary');

// Optional: auth middleware placeholder
const { verifyToken } = require('../utils/authMiddleware'); // simple JWT middleware (optional)

// Helpers
function fileToSlide(file, meta = {}) {
  const type = file.mimetype.startsWith('video') ? 'video' : 'image';
  // multer-storage-cloudinary file has `path` (url) and `filename` (public_id)
  const url = file.path || file.secure_url || file.url || '';
  const public_id = file.filename || file.public_id || '';
  return {
    type,
    url,
    public_id,
    animation: meta.animation || null,
    duration: meta.duration || (type === 'image' ? 5000 : 0)
  };
}

// POST /api/stories
// multipart/form-data: title, category, slidesMeta (JSON string, optional), files[]
router.post('/', parser.array('files'), async (req, res) => {
  console.log("========== NEW REQUEST ==========");
  try {
    // Validate required fields
    if (!req.body.title || !req.body.category) {
      return res.status(400).json({
        status: 'error',
        message: 'Title and category are required'
      });
    }

    // Validate files
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'No files uploaded'
      });
    }

    const { title, category, slidesMeta } = req.body;
    let meta = [];
    try {
      meta = slidesMeta ? JSON.parse(slidesMeta) : [];
    } catch (parseErr) {
      console.error("Error parsing slidesMeta:", parseErr);
      meta = [];
    }

    // Process files and create slides
    console.log("Processing files:", req.files.length, "files received");
    const slides = req.files.map((file, idx) => {
      console.log(`Processing file ${idx + 1}:`, file.originalname);
      return fileToSlide(file, meta[idx] || {});
    });

    // Create and save story
    const story = new Story({ title, category, slides });
    const savedStory = await story.save();
    console.log("Story saved successfully");

    return res.status(201).json({
      status: 'success',
      data: savedStory.toObject()
    });

  } catch (err) {
    console.error("❌ ERROR DETAILS:");
    console.error("Message:", err.message);
    console.error("Stack:", err.stack);

    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while processing your request',
      details: err.message
    });
  }
});

// GET /api/stories - list (lightweight)
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;

    // ✅ INCLUDE slides but only first one
    const stories = await Story.find(filter)
      .sort({ createdAt: -1 })
      .select("title category createdAt slides")
      .lean();

    // ✅ Add preview field (first slide)
    const finalStories = stories.map((story) => {
      const preview = story.slides?.length > 0 ? story.slides[0].url : null;

      return {
        _id: story._id,
        title: story.title,
        category: story.category,
        createdAt: story.createdAt,
        preview,        // ✅ this is what homepage uses
      };
    });

    res.json(finalStories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// GET /api/stories/:id - full story
router.get('/:id', async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ message: 'Story not found' });
    res.json(story);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/stories/:id
// Accepts multipart form-data with optional new files + existingSlides JSON string describing slides to keep (and their meta)
router.put('/:id', /*verifyToken,*/ parser.array('files'), async (req, res) => {
  try {
    const { title, category, slidesMeta, existingSlides } = req.body;
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ message: 'Story not found' });

    // Parse existingSlides - array of slide objects that the frontend wants to keep
    const keepSlides = existingSlides ? JSON.parse(existingSlides) : [];

    // Determine which public_ids to delete (those in DB that are not in keepSlides)
    const keepPublicIds = new Set(keepSlides.filter(s => s.public_id).map(s => s.public_id));
    const toDelete = story.slides.filter(s => s.public_id && !keepPublicIds.has(s.public_id));

    // Delete from Cloudinary (best-effort; continue even if errors)
    for (const s of toDelete) {
      try {
        const resourceType = s.type === 'video' ? 'video' : 'image';
        await cloudinary.uploader.destroy(s.public_id, { resource_type: resourceType });
      } catch (err) {
        console.warn('Cloudinary delete failed for', s.public_id, err.message);
      }
    }

    // Build updated slides: start with keepSlides (they already have url/public_id), then append newly uploaded files
    const meta = slidesMeta ? JSON.parse(slidesMeta) : [];
    const uploadedSlides = (req.files || []).map((file, idx) => fileToSlide(file, meta[idx] || {}));

    // ensure keepSlides have the expected fields (type,url,public_id,animation,duration)
    const normalizedKeepSlides = keepSlides.map(s => ({
      type: s.type,
      url: s.url,
      public_id: s.public_id || null,
      animation: s.animation || null,
      duration: s.duration || (s.type === 'image' ? 5000 : 0)
    }));

    const newSlides = normalizedKeepSlides.concat(uploadedSlides);

    story.title = title || story.title;
    story.category = category || story.category;
    story.slides = newSlides;
    story.updatedAt = Date.now();

    await story.save();
    res.json(story);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/stories/:id
router.delete('/:id', /*verifyToken,*/ async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ message: 'Story not found' });

    // Delete associated Cloudinary resources (best-effort)
    for (const s of story.slides) {
      if (s.public_id) {
        try {
          const resourceType = s.type === 'video' ? 'video' : 'image';
          await cloudinary.uploader.destroy(s.public_id, { resource_type: resourceType });
        } catch (err) {
          console.warn('Cloudinary delete failed for', s.public_id, err.message);
        }
      }
    }

    await Story.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
