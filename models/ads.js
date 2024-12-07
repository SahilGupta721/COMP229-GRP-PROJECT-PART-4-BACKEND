const mongoose = require('mongoose');
// const Schema = mongoose.Schema;
 
let adsModel = mongoose.Schema(
    {
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
    },
    {
        collection: "ads"
    }
);

adsModel.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) { delete ret._id }
});


module.exports = mongoose.model('Ads', adsModel);