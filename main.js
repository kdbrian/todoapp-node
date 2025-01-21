const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const morgan = require('morgan');


const app = express();
const port = process.env.PORT || 6969

app.use(bodyParser.json());

if ((process.env.NODE_ENV || 'dev' ) == 'dev')
    app.use(morgan('dev'))
    


// In-memory persistence
let todos = [];

const swaggerOpt = {

	swaggerDefinition: {
		myapi:'3.0.0',
		info : {
			title : 'todolist-api',
			version: '1.0.0',
			description:'todo list app api'
		},
		servers:[
			{ url : `http://localhost:${port}`}
		]
	},

	apis: ['./*.js']

};

const docs = swaggerJsDoc(swaggerOpt)


app.use('/', swaggerUi.serve, swaggerUi.setup(docs));

/**
 * @swagger
 * /todos:
 *   get:
 *     summary: Get all to-do items
 *     responses:
 *       200:
 *         description: List of to-do items
 */
app.get('/todos', (req, res) => {
    res.status(200).json({ success: true, data: todos });
});


/**
 * @swagger
 * /todos/{id}:
 *   get:
 *     summary: Get a single to-do item by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The to-do ID
 *     responses:
 *       200:
 *         description: A single to-do item
 *       404:
 *         description: To-Do not found
 */
app.get('/todos/:id', (req, res) => {
    const { id } = req.params;
    const todo = todos.find(item => item.id === id);

    if (!todo) {
        return res.status(404).json({ success: false, message: 'To-Do not found' });
    }

    res.status(200).json({ success: true, data: todo });
});


/**
 * @swagger
 * /todos:
 *   post:
 *     summary: Create a new to-do item
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: To-Do created successfully
 *       400:
 *         description: Bad request
 */
app.post('/todos', (req, res) => {
    const { title, description } = req.body;

    if (!title || !description) {
        return res.status(400).json({ success: false, message: 'Title and description are required' });
    }

    const newTodo = {
        id: uuidv4(),
        title,
        description,
        completed: false,
        createdAt: new Date().toISOString(),
    };

    todos.push(newTodo);
    res.status(201).json({ success: true, data: newTodo });
});

/**
 * @swagger
 * /todos/{id}:
 *   put:
 *     summary: Update an existing to-do item
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The to-do ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               completed:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: To-Do updated successfully
 *       404:
 *         description: To-Do not found
 */
app.put('/todos/:id', (req, res) => {
    const { id } = req.params;
    const { title, description, completed } = req.body;

    const todoIndex = todos.findIndex(item => item.id === id);

    if (todoIndex === -1) {
        return res.status(404).json({ success: false, message: 'To-Do not found' });
    }

    const updatedTodo = {
        ...todos[todoIndex],
        title: title || todos[todoIndex].title,
        description: description || todos[todoIndex].description,
        completed: completed !== undefined ? completed : todos[todoIndex].completed,
    };

    todos[todoIndex] = updatedTodo;
    res.status(200).json({ success: true, data: updatedTodo });
});

/**
 * @swagger
 * /todos/{id}:
 *   delete:
 *     summary: Delete a to-do item
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The to-do ID
 *     responses:
 *       200:
 *         description: To-Do deleted successfully
 *       404:
 *         description: To-Do not found
 */
app.delete('/todos/:id', (req, res) => {
    const { id } = req.params;

    const todoIndex = todos.findIndex(item => item.id === id);

    if (todoIndex === -1) {
        return res.status(404).json({ success: false, message: 'To-Do not found' });
    }

    todos.splice(todoIndex, 1);
    res.status(200).json({ success: true, message: 'To-Do deleted successfully' });
});

app.listen(port, () => {
    console.log(`To-Do List API running at http://localhost:${port}`);
});
