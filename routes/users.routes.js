const express = require('express');
const { userModel } = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const userRouter = express.Router();

/**
 * @swagger
 * components:
 *  schemas:
 *      user:
 *          type: object
 *          properties:
 *              id:
 *                  type: string
 *                  description: The auto-generated id by mongodb
 *              name: 
 *                  type: string
 *                  description: user name
 *              age: 
 *                  type: integer
 *                  description: user age
 *              location:
 *                  type: string
 *                  description: user's location
 *              pass:
 *                  type: string
 *                  description: user's password
 *      loginDetails:
 *          type: object
 *          properties:
 *              name: 
 *                  type: string
 *                  description: user Name
 *              pass:
 *                  type: string   
 *                  description: user password
 */

/**
 * @swagger
 * /user/register:
 *  post:
 *      summary: This will add a new user in the database
 *      tags: [Users]
 *      requestBody:
 *          required: true
 *      responses:
 *          200:
 *              description: This will add a new user in the database
 *              content: 
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          item:
 *                              $ref: "#/components/schemas/user"
 */


userRouter.post('/register', async (req, res)=>{
    const data = req.body;
    const saltRounds = +process.env.salt
    try{
        data.password = await bcrypt.hash(data.password, saltRounds);
        const newUser = new userModel(data);
        await newUser.save();
        res.send({"Msg": "New User added in the database"});
    }catch(err){
        res.status(400).send({"err": err.message});
    }
})

/**
 * @swagger
 * /user/login:
 *  post:
 *      summary: This route is used to get the user logged In
 *      tags: [Users]
 *      requestBody:
 *          required: true
 *          responses:
 *              200:
 *                  description: This will check whether the user is present in the database or not
 *                  content:
 *                      application/json:
 *                          schema: 
 *                              type: object
 *                              item:
 *                                  $ref: "#/components/schemas/loginDetails"
 */

userRouter.post('/login', async(req, res)=>{
    try{
        const data = req.body;
        const key = process.env.secretKey;
        const name = data.name;
        const pass = data.password;
        const user = await userModel.findOne({name});
        const id = user._id;
        bcrypt.compare(pass, user.password || '', (err, result)=>{
            if(result){
                res.status(200).send({"msg": "Login Successfully", "token": jwt.sign({id, name}, key, {expiresIn: "1h"})})
            }else{
                res.status(400).send({"err": "Something went wrong"})
            }
        })
    }catch(err){
        console.log(err.message);
        res.status(400).send('Something went wrong');
    }
})

module.exports = {
    userRouter
}