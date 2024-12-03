let UserModel = require('../models/users');

module.exports.list = async function (req, res, next) {
    try {
        let list = await UserModel.find({}, '-password');
        res.json({ list })
    } catch (error) {
        console.log(error);
        next(error);
    }
}; 

module.exports.create = async function (req, res, next) {
    try {
        let newUser = new UserModel(req.body);
        let result = await UserModel.create(newUser);
        res.json({
            success: true,
            message: 'User registered succesfully'
        })
        console.log(result)
    } catch (error) {
        console.log(error);
        next(error);
    }
};

module.exports.getUser = async function (req, res, next) {
    try {

        let uId = req.params.userId;
        req.user = await UserModel.findOne({ _id: uId }, '-password');
        next();
    } catch (error) {
        console.log(error);
        next(error);
    }
};

module.exports.sendById = async function (req, res, next) {
    res.json(req.user);
};

module.exports.update = async function (req, res, next) {
    try {
        let uId = req.params.userId;
        let updateUser = new UserModel(req.body);
        updateUser._id = uId;

        let result = await UserModel.updateOne({ _id: uId }, updateUser);
        if (result.modifiedCount > 0) {
            res.json({
                success: true,
                message: 'User updated succesfully'
            })
        } else {
            throw new Error('User not updated. Are you sure it exist?')
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
};


module.exports.remove = async function (req, res, next) {
    try {
        let uId = req.params.userId;
        
        let result = await UserModel.deleteOne({ _id: uId });
        if (result.deletedCount > 0) {
            res.json({
                success: true,
                message: 'User deleted succesfully'
            })
        } else {
            throw new Error('User not deleted. Are you sure it exixts?')
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
};
