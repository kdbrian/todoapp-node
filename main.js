// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const swaggerConf = require('./middleware/swagger.conf')
const todoRouter = require('./routes/todos');
const morgan = require('morgan');



// Middleware
app.use(bodyParser.json());
swaggerConf(app)


app.use('/api', todoRouter)


if ((process.env.NODE_ENV || 'dev') == 'dev')
    app.use(morgan('dev'))

const port = process.env.PORT || 6969 ;



// Start the server
app.listen(port, () => {
    console.log(`To-Do List API running at http://localhost:${port}`);
});
