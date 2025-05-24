const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("../config/claudinary.config");
const FileModel = require("../models/file.model");

const auth = require("../middleware/auth");

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Upload file route
router.post("/upload", auth, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload to cloudinary
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;

    const cloudinaryResponse = await cloudinary.uploader.upload(dataURI, {
      resource_type: "auto",
      folder: "drive-files",
    });

    // Save file details to database
    const file = await FileModel.create({
      filename: req.file.originalname,
      fileUrl: cloudinaryResponse.secure_url,
      publicId: cloudinaryResponse.public_id,
      size: req.file.size,
      uploadedBy: req.user?._id, // Will be set after you implement auth middleware
    });

    res.redirect("/home");
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error uploading file",
    });
  }
});

// Get all files
router.get("/files", auth, async (req, res) => {
  try {
    const files = await FileModel.find({
      uploadedBy: req.user?._id,
    });
    res.json(files);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching files",
    });
  }
});

// Download/access file
router.get("/download/:fileId", auth, async (req, res) => {
  try {
    const file = await FileModel.findById(req.params.fileId);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }
    res.redirect(file.fileUrl);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error downloading file",
    });
  }
});

// Delete routes
router.delete("/delete/:fileId", auth, async (req, res) => {
  try {
    const file = await FileModel.findById(req.params.fileId);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(file.publicId);

    // Delete from database
    await FileModel.findByIdAndDelete(req.params.fileId);

    res.json({ success: true, message: "File deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error deleting file",
    });
  }
});

module.exports = router;
