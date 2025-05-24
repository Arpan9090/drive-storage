const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    filename: String,
    fileUrl: String,
    publicId: String,
    size: Number,
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('File', fileSchema);