var express = require('express');
var router = express.Router();

let adsController = require('../controllers/ads');
let authController = require('../controllers/auth');

/* GET ads listing. */// Just for check
router.get('/', function(req, res, next) {
    res.send('Hello, this is from the ads.');
});

router.get('/list', adsController.adsList);

router.get('/get/:id', adsController.getByID);

router.post('/create',
  authController.requireSignin, // Ensure the user is signed in
  adsController.processAdd
);

router.put('/edit/:id',
  authController.requireSignin, // Ensure the user is signed in
  adsController.hasAuthorization, // Check if the user is authorized
  adsController.processEdit
);

router.put('/disable/:id',
  authController.requireSignin, // Ensure the user is signed in
  adsController.hasAuthorization, // Check if the user is authorized
  adsController.performDisable
);


module.exports = router;
