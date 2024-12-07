require('dotenv').config();

module.exports = {
    "ATLASDB":process.env.ATLASDB,
    "SECRETKEY": process.env.SECRETKEY,
    JWT_SECRET: process.env.JWT_SECRET
}