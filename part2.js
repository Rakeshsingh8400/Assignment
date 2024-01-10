const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3001;

app.use(express.json());

// Set up multer for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// Store uploaded video file
app.post('/upload', upload.single('video'), (req, res) => {
  try {
    // Process the uploaded video (save to disk, database, etc.)
    const videoPath = path.join(__dirname, 'uploads', req.file.originalname);

    // For simplicity, this example just moves the file to the 'uploads' directory
    fs.renameSync(req.file.path, videoPath);

    res.status(200).json({ message: 'Video upload successful', videoPath });
  } catch (error) {
    console.error('Error uploading video', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Store subtitles data and create subtitles file
app.post('/subtitles', (req, res) => {
  try {
    const { videoPath, subtitles } = req.body;

    // Process subtitles data (save to disk, database, etc.)
    const subtitlesPath = path.join(__dirname, 'uploads', 'subtitles.txt');

    const subtitlesText = subtitles
      .map((subtitle) => `${subtitle.time.toFixed(2)}s - ${subtitle.text}`)
      .join('\n');

    fs.writeFileSync(subtitlesPath, subtitlesText);

    res.status(200).json({ message: 'Subtitles creation successful', subtitlesPath });
  } catch (error) {
    console.error('Error creating subtitles', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Retrieve subtitles file associated with the video
app.get('/subtitles/:videoName', (req, res) => {
  try {
    const videoName = req.params.videoName;
    const subtitlesPath = path.join(__dirname, 'uploads', 'subtitles.txt');

    // You may want to associate subtitles with specific videos in a more sophisticated way
    // This example assumes a single subtitles file for all videos
    res.download(subtitlesPath, `subtitles_${videoName}.txt`);
  } catch (error) {
    console.error('Error retrieving subtitles', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
