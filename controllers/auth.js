let User = require('../models/users');
let config = require('../config/config');
let jwt = require('jsonwebtoken');
let { expressjwt } = require('express-jwt');


module.exports.signin = async function(req, res, next){
    try {
        console.log(req.body);
        let user = await User.findOne({"email": req.body.email});
        console.log(user);
        if(!user)
            throw new Error('User not found.');
        if(!user.authenticate(req.body.password))
            throw new Error("Email and/or password don't match.");

        let payload = {
            id: user._id,
            username: user.username
        }

        // Generates the token
        let token = jwt.sign(payload, config.SECRETKEY, {
            algorithm: 'HS512',
            expiresIn: "20min"
        })

        // Sends the token in the body of the response to the client.
        res.json(
            {
                success: true,
                token: token
            })
    } catch (error) {
        console.log(error);
        next(error);
    }
}

// Check the token validation
module.exports.requireSignin = expressjwt({
    secret: config.SECRETKEY,
    algorithms: ['HS512'],
    userProperty: 'auth'
});
