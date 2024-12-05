// let AdsModel = require('../models/ads');
// let UserModel = require('../models/users'); // new Added 

// module.exports.adslist = async function (req, res, next) {
//     try {
//         let ads = await AdsModel.find({ isActive: true }).populate('owner'); 
//         // res.json({ ads });
//         res.json( ads );
//     } catch (error) {
//         console.log(error);
//         next(error);
//     }
// };

// module.exports.createAd = async (req, res, next) => {
//     try {
//         console.log("req.auth: ", req.auth);
//         let newAd = AdsModel({
//             title: req.body.title,
//             description: req.body.description,
//             price: req.body.price,
//             createdAt: new Date(),
//             expiresAt: req.body.expiresAt,
//             isActive: true,
//             owner: (req.body.owner == null || req.body.owner == "")? req.auth.id : req.body.owner
//         });

//         let result = await AdsModel.create(newAd);

//         console.log(result);
//         // res.json(result);
//         res.json({
//             success: true,
//             message: 'Item created successfully',
//             ad: result 
//         });

//     } catch (error) {
//         console.log(error);
//         next(error);
//     }
// };

// // Julio's Approach *** get by Id 
// module.exports.getAds = async function (req, res, next) {
//     try {
//         let ads = await AdsModel.findOne({ _id: req.params.id, isActive: true });
//         if (!ads)
//             throw new Error('Item not found. Are you sure it exists?');
//         res.json(ads);

//     } catch (error) {
//         console.log(error);
//         next(error);
//     }
// }


// // // Get Ad/item by id ****My approach
// // module.exports.getAd = async function (req, res, next) {
// //     try {
// //         let adId = req.params.adId;
// //         req.ad = await AdsModel.findOne({ _id: adId, isActive: true }); 
// //         if (!req.ad) 
// //             throw new Error('Item not found or unavailable.');
// //         next();
// //     } catch (error) {
// //         console.log(error);
// //         next(error);
// //     }
// // };
// // // next funtction to getAd
// // module.exports.sendById = async function (req, res, next) {
// //     res.json(req.ad);
// // };

// module.exports.update = async function (req, res, next) {
//     try {
//         let adId = req.params.id;
        
//         let updateAd = {
//             _id: req.params.id,
//             title: req.body.title,
//             description: req.body.description,
//             price: req.body.price,
//             createdAt: new Date(),
//             expiresAt: req.body.expiresAt,
//             isActive: true,
//             owner: (req.body.owner == null || req.body.owner == "")? req.auth.id : req.body.owner
//             // owner: req.body.owner
//         };
//         let result = await AdsModel.updateOne({ _id: adId }, updateAd); 
//         console.log(result);
//         if (result.modifiedCount > 0) {
//             res.json({
//                 success: true,
//                 message: 'Item updated successfully',
//                 ad: result
//             });
//         } else {
//             throw new Error('Item not updated. Are you sure it exists?');
//         }
//     } catch (error) {
//         console.log(error);
//         next(error);
//     }
// };

// module.exports.remove = async function (req, res, next) {
//     try {
//         let adId = req.params.adId;
//         let result = await AdsModel.updateOne({ _id: adId, owner: req.user._id }, { isActive: false }); 
//         if (result.modifiedCount > 0) {
//             res.json({
//                 success: true,
//                 message: 'Item disabled successfully'
//             });
//         } else {
//             throw new Error('Item not disabled. Are you sure it exists and you are the owner?');
//         }
//     } catch (error) {
//         console.log(error);
//         next(error);
//     }
// };

// module.exports.hasAuthorization = async function(req, res, next){

//     try {
//         let id = req.params.id
//         let adsItem = await AdsModel.findById(id).populate('owner');
//         console.log(adsItem);

//         // If there is no item found.
//         if (adsItem == null) {
//             throw new Error('Item not found.') // Express will catch this on its own.
//         }
//         else if (adsItem.owner != null) { // If the item found has a owner.

//             if (adsItem.owner.id != req.auth.id) { // If the owner differs.

//                 let currentUser = await UserModel.findOne({_id: req.auth.id}, 'admin');
  
//                 if(currentUser.admin != true){ // If the user is not a Admin

//                     console.log('====> Not authorized');
//                     return res.status(403).json(
//                         {
//                             success: false,
//                             message: 'User is not authorized to modify this item.'
//                         }
//                     );
//                 }
//             }
//         }

//         // If it reaches this point, runs the next middleware.
//         next();
//     } catch (error) {
//         console.log(error);   
//         next(error);
//     }
// }



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
