var express = require('express');
var router = express.Router();

let questionsController = require('../controllers/questions');
let authController = require('../controllers/auth');

/* GET questions listing. */
router.get('/', function(req, res, next) {
    res.send('Hello , this is from the questions.');
  });

router.get('/:adId', questionsController.list);
router.post('/create/:adId', questionsController.createQuestion); // No authentication required for creating questions
router.get('/get/:questionId', questionsController.getQuestion, questionsController.sendById);
router.put('/edit/:questionId', authController.requireSignin, questionsController.update); // Authentication required for answering questions
router.delete('/delete/:questionId', authController.requireSignin, questionsController.remove); // Optional, if needed

module.exports = router;
