var express = require('express');
var router = express.Router();

let adsController = require('../controllers/ads');
let authController = require('../controllers/auth');

/* GET ads listing. */
router.get('/', function(req, res, next) {
    res.send('Hello , this is from the ads.');
  });

router.get('/list', adsController.list);
router.post('/create', authController.requireSignin, adsController.createAd);
router.get('/get/:adId', adsController.getAd, adsController.sendById);
router.put('/edit/:adId', authController.requireSignin, adsController.update);
router.delete('/delete/:adId', authController.requireSignin, adsController.remove);

module.exports = router;

