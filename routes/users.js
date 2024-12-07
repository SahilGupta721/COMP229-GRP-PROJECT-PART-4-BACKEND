var express = require('express');
var router = express.Router();

let usersController = require('../controllers/users');
let authController = require('../controllers/auth');

/* GET users listing. */// Just for check
router.get('/', function(req, res, next) {
  res.send('Hello , this is from the users.');
});

router.post('/signin', authController.signin);
router.get('/list', usersController.list);
router.post('/create', usersController.create);
router.get('/get/:userId', usersController.getUser, usersController.sendById);
router.put('/edit/:userId', usersController.update);
router.delete('/delete/:userId', usersController.remove);

router.put('/setadmin/:userID', 
  authController.requireSignin, 
  usersController.setAdmin
);

module.exports = router;
