// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const swaggerConf = require('./middleware/swagger.conf')
const todoRouter = require('./routes/todos');
const morgan = require('morgan');
const app = express()


// Middlewares
app.use(bodyParser.json());
swaggerConf(app)

//entry point
app.use('/api', todoRouter)


if ((process.env.NODE_ENV || 'dev') == 'dev')
    app.use(morgan('dev'))

module.exports = app