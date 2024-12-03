var express = require('express');
var router = express.Router();

let inventoryController = require('../controllers/inventory');
let authController = require('../controllers/auth');


/* GET list of items */
router.get('/list', inventoryController.invetoryList);

router.get('/get/:id', inventoryController.getByID);

// Routers for edit
router.put('/edit/:id', authController.requireSignin, inventoryController.processEdit);

// Delete
router.delete('/delete/:id',  authController.requireSignin, inventoryController.performDelete);

/* POST Route for processing the Add page - CREATE Operation */
router.post('/add', authController.requireSignin, inventoryController.processAdd);

module.exports = router;