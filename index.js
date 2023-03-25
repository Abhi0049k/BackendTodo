const express = require('express');
const cors = require('cors')
const { userRouter } = require('./routes/users.routes');
const { connection } = require('./db');
const { todoRouter } = require('./routes/todos.routes');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: "Practicing Swagger",
            version: "1.0.0"
        },
        servers: [
            {
                url: 'http://localhost:8998'
            }
        ]
    },
    apis: ['./routes/*.js']
}

const swaggerSpec = swaggerJSDoc(options)

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/user', userRouter);
app.use('/todo', todoRouter);

app.get('/', (req, res) => {
    res.status(200).send({ "msg": "Welcome to the home page" })
})

app.get('*', (req, res) => {
    res.status(404).send({ "err": "404 Page Not Found" });
})

app.listen(process.env.port, () => {
    connection();
    console.log('Server is running at port', process.env.port);
})