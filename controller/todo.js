
const { v4: uuidv4 } = require('uuid');

// In-memory data store
let todos = [];


exports.defaultPathHandler = (req, res) => {
    res.status(200).json({
        success:true,
        paths : [
            {"swagger-ui" : "/api-docs"},
        ]
    })
}

exports.getAllTodos = (req, res) => {
    const { isDone } = req.query
    res.status(200).json({ success: true, data: isDone !=  undefined ? todos.filter((todo) => todo.completed === isDone ) : todos });
}

exports.createTodo = (req, res) => {
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
}

exports.getTodoWithId = (req, res) => {
    const { id } = req.params;
    const todo = todos.find(item => item.id === id);

    if (!todo) {
        return res.status(404).json({ success: false, message: 'To-Do not found' });
    }

    res.status(200).json({ success: true, data: todo });
}

exports.updateTodoWithId = (req, res) => {
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
}

exports.deleteTodoWithId = (req, res) => {
    const { id } = req.params;

    const todoIndex = todos.findIndex(item => item.id === id);

    if (todoIndex === -1) {
        return res.status(404).json({ success: false, message: 'To-Do not found' });
    }

    todos.splice(todoIndex, 1);
    res.status(200).json({ success: true, message: 'To-Do deleted successfully' });
}