// models/questions.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
    questionTxt: String ,
    answerTxt:  String ,
    createdAt: { type: Date, default: Date.now },
    adId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ad",
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
});

module.exports = mongoose.model('Question', QuestionSchema);
