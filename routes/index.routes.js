const express = require("express")
const router = express.Router()

const FileModel = require("../models/file.model")
const auth = require("../middleware/auth")

router.get('/home', auth,async (req, res) =>{
    try {
        const files = await FileModel.find({
            uploadedBy: req.user?._id
        });
        res.render('home', { files });
    } catch (error) {
        console.error('Error fetching files:', error);
        res.render('home', { files: [] });
    }
})

module.exports = router;