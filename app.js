// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const swaggerConf = require('./middleware/swagger.conf')
const todoRouter = require('./routes/todos');
const morgan = require('morgan');
const app = express()


// Middleware
app.use(bodyParser.json());
swaggerConf(app)


app.use('/api', todoRouter)


if ((process.env.NODE_ENV || 'dev') == 'dev')
    app.use(morgan('dev'))

module.exports = app