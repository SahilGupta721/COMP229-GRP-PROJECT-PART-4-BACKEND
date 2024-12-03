let AdsModel = require('../models/ads');

module.exports.list = async function (req, res, next) {
    try {
        let ads = await AdsModel.find({ isActive: true }).populate('owner'); 
        res.json({ ads });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

module.exports.createAd = async (req, res, next) => {
    try {
        console.log("req.auth: ", req.auth);
        let newAd = new AdsModel({
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            createdAt: new Date(),
            expiresAt: req.body.expiresAt,
            isActive: true,
            owner: req.auth.id 
        });

        let result = await AdsModel.create(newAd);

        console.log(result);
        res.json({
            success: true,
            message: 'Item created successfully',
            ad: result 
        });

    } catch (error) {
        console.log(error);
        next(error);
    }
};

// Get Ad/item by id
module.exports.getAd = async function (req, res, next) {
    try {
        let adId = req.params.adId;
        req.ad = await AdsModel.findOne({ _id: adId, isActive: true }); 
        if (!req.ad) 
            throw new Error('Item not found or unavailable.');
        next();
    } catch (error) {
        console.log(error);
        next(error);
    }
};
// next funtction to getAd
module.exports.sendById = async function (req, res, next) {
    res.json(req.ad);
};

module.exports.update = async function (req, res, next) {
    try {
        let adId = req.params.adId;
        console.log("req.auth: ", req.auth);
        let updateAd = new AdsModel({
            _id: adId,
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            createdAt: new Date(),
            expiresAt: req.body.expiresAt,
            isActive: true,
            owner: req.auth.id 
        });
        let result = await AdsModel.updateOne({ _id: adId }, updateAd); 
        if (result.modifiedCount > 0) {
            res.json({
                success: true,
                message: 'Item updated successfully',
                ad: result
            });
        } else {
            throw new Error('Item not updated. Are you sure it exists?');
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
};

module.exports.remove = async function (req, res, next) {
    try {
        let adId = req.params.adId;
        console.log('this is adId  '+adId);
        
        let result = await AdsModel.deleteOne({ _id: adId, owner: req.auth.id }); 
        console.log('this is result  '+result);
        if (result.deletedCount > 0) {
            res.json({
                success: true,
                message: 'Item disabled successfully'
            });
        } else {
            throw new Error('Item not disabled. Are you sure it exists and you are the owner?');
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
};
