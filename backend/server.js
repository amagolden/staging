const express = require("express");
const cors = require('cors');
const multer = require("multer");
const { OpenAI } = require("openai");
const dotenv = require("dotenv");
const fs = require("fs");

dotenv.config({ path: './.env.local' });

const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));
const upload = multer({ dest: "uploads/" });

// Initialize OpenAI with API Key
const openai = new OpenAI({
  apiKey: `${process.env.REACT_APP_OPENAI_API_KEY}`,
});

console.log(`openai api ${process.env.REACT_APP_OPENAI_API_KEY}`);

app.post("/api/edit-image", upload.single("image"), async (req, res) => {
  try {
    const prompt = req.body.prompt;
    const imagePath = req.file.path;

    // Request for image editing (via OpenAI API)
    const response = await openai.images.edit({
      model: "dall-e-2",
      image: fs.createReadStream(imagePath),
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });

    fs.unlinkSync(imagePath); // Clean up the uploaded file

    res.json({ editedImageUrl: response.data[0].url });
  } catch (error) {
    console.error("Error editing image:", error);
    res.status(500).json({ error: "Failed to edit image" });
  }
});

app.listen(8000, () => console.log("Server running on http://localhost:8000"));
