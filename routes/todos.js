const Router = require('express').Router()
const {
    defaultPathHandler, getAllTodos,
    createTodo,
    deleteTodoWithId,
    updateTodoWithId,
    getTodoWithId
} = require('../controller/todo')



Router.get('/', defaultPathHandler)
      .get('/todos', getAllTodos)
      .get('/todos/:id', getTodoWithId)
      .post('/todos', createTodo)
      .put('/todos/:id', updateTodoWithId)
      .delete('/todos/:id', deleteTodoWithId)


module.exports = Router