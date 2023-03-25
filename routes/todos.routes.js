const express = require('express');
const { todoModel } = require('../models/todos.model');
const { authorization } = require('../middlewares/authorization.middleware');

const todoRouter = express.Router();

todoRouter.use(authorization);

/**
 * @swagger
 * components:
 *  schemas:
 *      todo:
 *          type: object
 *          properties:
 *              id: 
 *                  type: string
 *                  description: The id for that particular todo
 *              task: 
 *                  type: string
 *                  description: what is the task?
 *              desc:
 *                  type: string
 *                  description: description about the todo
 *              pending: 
 *                  type: string
 *                  description: checks whether the task is complete or not
 *              userId:
 *                  type: string
 *                  description: to which user does this todo belongs to
 */

/**
 * @swagger
 * todos/:
 *  get:
 *      summary: To get the list of all todo for that particular user
 *      tags: [Todo]
 *      responses:
 *          200:
 *              description: The list of all the todo for a particular user 
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          item:
 *                              $ref: "#/components/schemas/todo"
 *          400:
 *              description: Something went wrong
 */

todoRouter.get('/', async (req, res)=>{
    const userId = req.body.userId;
    try{
        const data = await todoModel.find({userId});
        res.status(200).send(data);
    }catch(err){
        res.status(400).send({"err": "Something went wrong!!!"});
    }
})

/**
 * @swagger
 * todos/id:
 *  get:
 *      summary: To get the list of all todo for that particular user
 *      tags: [Todo]
 *      responses:
 *          200:
 *              description: The list of all the todo for a particular user 
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          item:
 *                              $ref: "#/components/schemas/todo"
 *          400:
 *              description: Something went wrong
 */

todoRouter.get('/:id', async(req, res)=>{
    const {id} = req.params;
    try{
        const data = await todoModel.findById({_id: id});
        res.status(200).send(data);
    }catch(err){
        res.status(400).send({"err": "Something went wrong"})
    }
})

/**
 * @swagger
 * todos/add/:
 *  post:
 *      summary: To add a new todo item for a particular user
 *      tags: [Todo]
 *      responses:
 *          200:
 *              description: To add a new todo item 
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          item:
 *                              $ref: "#/components/schemas/todo"
 *          500:
 *              description: Server err
 */

todoRouter.post('/add', async (req, res)=>{
    console.log(req)
    try{
        const task = new todoModel(req.body);
        await task.save();
        res.status(201).send({"msg": "Task has been added in the database"});
    }catch(err){
        console.log(err);
        res.status(500).send({"err": "Something went Wrong!!"});
    }
})

/**
 * @swagger
 * todos/update/id:
 *  patch:
 *      summary: To changes in a todo item for a particular user
 *      tags: [Todo]
 *      requestBody:
 *          required: true
 *      responses:
 *          200:
 *              description: To make changes todo item 
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          item:
 *                              $ref: "#/components/schemas/todo"
 *          500:
 *              description: Server err
 */

todoRouter.patch('/update/:id', async (req, res)=>{
    try{
        const {id} = req.params;
        const body = req.body;
        await todoModel.findByIdAndUpdate({_id: id}, body);
        res.status(200).send({"msg": "Changes made in the task"});
    }catch(err){
        res.status(400).send({"err": "Something went wrong!!!"});
    }
})

/**
 * @swagger
 * todos/delete/id:
 *  delete:
 *      summary: To delete a todo item for a particular user
 *      tags: [Todo]
 *      responses:
 *          200:
 *              description: To Delete a todo item 
 *          500:
 *              description: Server err
 */

todoRouter.delete('/delete/:id', async (req, res)=>{
    try{
        const {id} = req.params;
        await todoModel.findByIdAndDelete({_id: id});
        res.status(200).send({"msg": "Task deleted"});
    }catch(err){
        res.status(400).send({"err": "Something went wrong!!!"});
    }
})

module.exports = {
    todoRouter
}