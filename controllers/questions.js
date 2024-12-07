// controllers/questions.js
let QuestionModel = require('../models/questions');
let AdsModel = require('../models/ads');

// List questions for a specific ad
module.exports.list = async function (req, res, next) {
    try {
        let questions = await QuestionModel.find({ adId: req.params.adId }).populate('owner');
        res.json({ questions });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

// Create a question for a specific ad
module.exports.createQuestion = async (req, res, next) => {
    try {
        let ad = await AdsModel.findOne({ _id: req.params.adId, isActive: true });
        if (!ad) throw new Error('Ad not found or inactive.');

        let newQuestion = new QuestionModel({
            questionTxt: req.body.questionTxt,
            createdAt: new Date(),
            adId: req.params.adId,
            owner: req.auth ? req.auth.id : null // Allow anonymous users to create questions
        });

        let result = await QuestionModel.create(newQuestion);

        console.log(result);
        res.json({
            success: true,
            message: 'Question posted successfully',
            question: result
        });

    } catch (error) {
        console.log(error);
        next(error);
    }
};

// Get a specific question by ID
module.exports.getQuestion = async function (req, res, next) {
    try {
        let questionId = req.params.questionId;
        req.question = await QuestionModel.findOne({ _id: questionId }).populate('owner');
        if (!req.question) 
            throw new Error('Question not found.');
        next();
    } catch (error) {
        console.log(error);
        next(error);
    }
};

// Send question by ID
module.exports.sendById = async function (req, res, next) {
    res.json(req.question);
};

// Update/Answering a question (only the ad owner can answer)
module.exports.update = async function (req, res, next) {
    try {
        let questionId = req.params.questionId;
        let question = await QuestionModel.findOne({ _id: questionId });
        let ad = await AdsModel.findOne({ _id: question.adId });

        if (req.auth.id !== ad.owner.toString()) {
            throw new Error('Only the ad owner can answer questions.');
        }

        let updateQuestion = {
            answerTxt: req.body.answerTxt,
            updatedAt: new Date()
        };

        let result = await QuestionModel.updateOne({ _id: questionId }, updateQuestion);
        if (result.modifiedCount > 0) {
            res.json({
                success: true,
                message: 'Question answered successfully'
            });
        } else {
            throw new Error('Question not updated. Are you sure it exists?');
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
};

// Remove a question (optional, if needed)
module.exports.remove = async function (req, res, next) {
    try {
        let questionId = req.params.questionId;
        let result = await QuestionModel.deleteOne({ _id: questionId });
        if (result.deletedCount > 0) {
            res.json({
                success: true,
                message: 'Question deleted successfully'
            });
        } else {
            throw new Error('Question not deleted. Are you sure it exists?');
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
};
