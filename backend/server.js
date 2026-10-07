const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
require('dotenv').config();
const { pool, query, initDB } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}


app.use('/uploads', express.static(uploadsDir));


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
   
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `hotel-${uniqueSuffix}${ext}`);
  },
});


const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedMime = /^image\/(jpeg|png|webp|gif|jpg)$/i;

  if (allowedExtensions.includes(ext) && allowedMime.test(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (.jpg, .jpeg, .png, .webp, .gif) are allowed!'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter,
});


app.get('/api/health', async (req, res) => {
  try {
    const result = await query('SELECT NOW() AS current_time');
    res.json({
      status: 'ok',
      database: 'connected',
      timestamp: result.rows[0].current_time,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      database: 'disconnected',
      error: error.message,
    });
  }
});


app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Please select an image file to upload' });
  }

  
  const imagePath = `/uploads/${req.file.filename}`;

  res.status(200).json({
    message: 'Image uploaded successfully',
    imagePath,
    filename: req.file.filename,
  });
});

app.get('/api/hotels', async (req, res) => {
  try {
    const result = await query('SELECT * FROM hotels ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching hotels:', error);
    res.status(500).json({ error: 'Failed to fetch hotels from database' });
  }
});


app.get('/api/hotels/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await query('SELECT * FROM hotels WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Hotel not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching hotel:', error);
    res.status(500).json({ error: 'Failed to fetch hotel from database' });
  }
});

app.post('/api/hotels', upload.single('image'), async (req, res) => {
  try {
    const { name, location, description, price, latitude, longitude } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: 'Hotel name and price are required' });
    }

   
    let imagePath = '';
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    } else if (req.body.image) {
      imagePath = req.body.image;
    }

    let imagesArray = [];
    if (req.body.images) {
      imagesArray = Array.isArray(req.body.images)
        ? req.body.images
        : [req.body.images];
    } else if (imagePath) {
      imagesArray = [imagePath];
    }

    const result = await query(
      `INSERT INTO hotels (name, location, description, price, latitude, longitude, image, images)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        name,
        location || 'New Location',
        description || '',
        parseFloat(price),
        latitude ? parseFloat(latitude) : null,
        longitude ? parseFloat(longitude) : null,
        imagePath,
        imagesArray,
      ]
    );

    console.log(`[Database] Hotel created with ID: ${result.rows[0].id}, image path: ${imagePath}`);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating hotel:', error);
    res.status(500).json({ error: error.message || 'Failed to create hotel' });
  }
});


app.put('/api/hotels/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { name, location, description, price, latitude, longitude } = req.body;

  try {
    
    let imagePath = req.file ? `/uploads/${req.file.filename}` : req.body.image;

    const result = await query(
      `UPDATE hotels
       SET name = COALESCE($1, name),
           location = COALESCE($2, location),
           description = COALESCE($3, description),
           price = COALESCE($4, price),
           latitude = COALESCE($5, latitude),
           longitude = COALESCE($6, longitude),
           image = COALESCE($7, image),
           images = CASE WHEN $7 IS NOT NULL THEN ARRAY[$7] ELSE images END
       WHERE id = $8
       RETURNING *`,
      [
        name || null,
        location || null,
        description || null,
        price ? parseFloat(price) : null,
        latitude ? parseFloat(latitude) : null,
        longitude ? parseFloat(longitude) : null,
        imagePath || null,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Hotel not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating hotel:', error);
    res.status(500).json({ error: error.message || 'Failed to update hotel' });
  }
});

// DELETE a hotel
app.delete('/api/hotels/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await query('DELETE FROM hotels WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Hotel not found' });
    }
    res.json({ message: 'Hotel deleted successfully', hotel: result.rows[0] });
  } catch (error) {
    console.error('Error deleting hotel:', error);
    res.status(500).json({ error: 'Failed to delete hotel' });
  }
});

// Multer 
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: `Upload error: ${err.message}` });
  } else if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
});

app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  await initDB();
});
