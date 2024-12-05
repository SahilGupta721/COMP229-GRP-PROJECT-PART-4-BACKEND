
let AdsModel = require('../models/ads');
let UserModel = require('../models/users');

module.exports.adsList = async function (req, res, next) {
    try {
        let ads = await AdsModel.find({ isActive: true }).populate('owner');
        res.json(ads);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

module.exports.getByID = async function (req, res, next) {
    try {
        let ad = await AdsModel.findOne({ _id: req.params.id });
        if (!ad)
            throw new Error('Ad not found. Are you sure it exists?');

        res.json(ad);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

module.exports.processAdd = async (req, res, next) => {
    try {
        console.log("req.auth: ", req.auth);
        let newAd = AdsModel({
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            createdAt: new Date(),
            expiresAt: req.body.expiresAt,
            isActive: true,
            owner: (req.body.owner == null || req.body.owner == "") ? req.auth.id : req.body.owner
        });

        let result = await AdsModel.create(newAd);

        console.log(result);
        res.json(result);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

module.exports.processEdit = async (req, res, next) => {
    try {
        let id = req.params.id;

        let updatedAd = {
            _id: req.params.id,
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            createdAt: new Date(),
            expiresAt: req.body.expiresAt,
            isActive: true,
            owner: (req.body.owner == null || req.body.owner == "") ? req.auth.id : req.body.owner
        };

        let result = await AdsModel.updateOne({ _id: id }, updatedAd); 
        console.log(result);

        if (result.modifiedCount > 0) {
            res.json({
                success: true,
                message: "Ad updated successfully."
            });
        } else {
            throw new Error('Ad not updated. Are you sure it exists?');
        }
    } catch (error) {
        next(error);
    }
};

module.exports.performDisable = async (req, res, next) => {
    try {
        let id = req.params.id;

        let result = await AdsModel.updateOne({ _id: id }, { isActive: false });
        console.log("====> Result: ", result);

        if (result.modifiedCount > 0) {
            res.json({
                success: true,
                message: "Ad disabled successfully."
            });
        } else {
            throw new Error('Ad not disabled. Are you sure it exists?');
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
};

module.exports.hasAuthorization = async function (req, res, next) {
    try {
        let id = req.params.id;
        let adItem = await AdsModel.findById(id).populate('owner');
        console.log(adItem);

        if (adItem == null) {
            throw new Error('Ad not found.');
        } else if (adItem.owner != null) {
            if (adItem.owner.id != req.auth.id) {
                let currentUser = await UserModel.findOne({ _id: req.auth.id }, 'admin');

                if (currentUser.admin != true) {
                    console.log('====> Not authorized');
                    return res.status(403).json({
                        success: false,
                        message: 'User is not authorized to modify this ad.'
                    });
                }
            }
        }

        next();
    } catch (error) {
        console.log(error);
        next(error);
    }
};
