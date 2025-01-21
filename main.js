// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = 6969;

// Swagger options
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'To-Do List API',
            version: '1.0.0',
            description: 'API for managing a to-do list',
        },
        servers: [
            {
                url: `http://localhost:${port}`,
            },
        ],
    },
    apis: ['./openapi-3.0.yml'],
};

app.get('/', (req, res) => {
    res.status(200).json({
        success:true,
        paths : [
            {"swagger-ui" : "/api-docs"},
        ]
    })
})

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Middleware
app.use(bodyParser.json());

// In-memory data store
let todos = [];

// Routes
app.get('/todos', (req, res) => {
    res.status(200).json({ success: true, data: todos });
});

app.get('/todos/:id', (req, res) => {
    const { id } = req.params;
    const todo = todos.find(item => item.id === id);

    if (!todo) {
        return res.status(404).json({ success: false, message: 'To-Do not found' });
    }

    res.status(200).json({ success: true, data: todo });
});

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

app.delete('/todos/:id', (req, res) => {
    const { id } = req.params;

    const todoIndex = todos.findIndex(item => item.id === id);

    if (todoIndex === -1) {
        return res.status(404).json({ success: false, message: 'To-Do not found' });
    }

    todos.splice(todoIndex, 1);
    res.status(200).json({ success: true, message: 'To-Do deleted successfully' });
});

// Start the server
app.listen(port, () => {
    console.log(`To-Do List API running at http://localhost:${port}`);
});
