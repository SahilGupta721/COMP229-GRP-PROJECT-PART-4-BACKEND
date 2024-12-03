const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdSchema = new Schema({
    title: String,
    description: String,
    price: String,
    createdAt: { type: Date, default: Date.now },
    expiresAt: Date,
    isActive: Boolean,
    owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
})

module.exports = mongoose.model('Ad', AdSchema);