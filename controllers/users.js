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
        req.user = await UserModel.findOne({ _id: uId }, '-hashed_password -salt' );
        // req.user = await UserModel.findOne({ _id: uId }, 'password'); // old one
        console.log(user);
        req.user = user;
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
        console.log(result);

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


module.exports.setAdmin = async function (req, res, next) {

    try {
        // Check if the current user is admin. Only admins can set another admin.
        let authorized = await UserModel.findOne({ _id: req.auth.id }, 'admin');
        console.log("authorized", authorized.admin);

        if (!authorized.admin) {
            return res.status('403').json(
                {
                    success: false,
                    message: "User is not authorized"
                }
            )
        }
        else
        {
            // Update one single field.
            let result = await UserModel.updateOne({ _id: req.params.userID }, {admin : true});
            console.log("setAdmin", result);
            if (result.modifiedCount > 0) {
                res.json(
                    {
                        success: true,
                        message: "User promoted successfully."
                    }
                );
            }
            else {
                // Express will catch this on its own.
                throw new Error('User not updated. Are you sure it exists?')
            }
        }
    } catch (error) {
        console.log(error);
        next(error)
    }

}