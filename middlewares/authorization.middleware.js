const jwt = require('jsonwebtoken');
const { userModel } = require('../models/user.model');
require('dotenv').config();


const authorization = async (req, res, next) => {
    const secretKey = process.env.secretKey
    const arr = req.headers.authorization.split(' ');
    const token = arr[1] || arr[0];
    if (!token) {
        res.status(400).send({ "err": "Please Provide the token" })
    } else {

        try {
            const result = jwt.verify(token, secretKey);
            const { id, name } = result;
            const data = await userModel.findById({ _id: id });
            if (data.name === name) {
                req.body.userId = id;
                next();
            } else {
                // Error can be due 
                // 1. jwt.verify
                // 2. user.model 
                res.status(400).send({ "err": "login again" });
            }
        } catch (err) {
            res.status(500).send({ "err": "Something went Wrong!!!" })
        }
    }
}


module.exports = {
    authorization
}