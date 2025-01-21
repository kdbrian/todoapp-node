const request = require('supertest');
const { v4: uuidv4 } = require('uuid');
const app = require('../app'); // Ensure this points to your app file
const port = process.env.PORT || 4000;

// Clear the in-memory data store before each test
let todos = []; // This must be the same `todos` variable in your app

describe('ToDo List API', () => {
    let server;

    beforeAll(() => {
        server = app.listen(port, () => {
            console.log(`Test server running on port ${port}`);
        });
    });

    afterAll(() => {
        server.close();
    });

    beforeEach(() => {
        todos.length = 0; // Clear the in-memory data store
    });

    describe('GET /todos', () => {
        it('should return an empty list initially', async () => {
            const res = await request(server).get('/api/todos');
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual([]);
        });

        it('should filter todos by completion status', async () => {
            // Create some todos
            todos.push(
                { id: uuidv4(), title: 'Test 1', description: 'Desc 1', completed: true },
                { id: uuidv4(), title: 'Test 2', description: 'Desc 2', completed: false }
            );

            const res = await request(server).get('/api/todos?isDone=true');
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveLength(1);
            expect(res.body.data[0].completed).toBe(true);
        });
    });

    describe('POST /todos', () => {
        it('should create a new todo item', async () => {
            const newTodo = {
                title: 'Test ToDo',
                description: 'This is a test todo item',
            };

            const res = await request(server).post('/api/todos').send(newTodo);
            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toMatchObject({
                title: newTodo.title,
                description: newTodo.description,
                completed: false, // Ensure default value
            });
            expect(res.body.data).toHaveProperty('id');
            expect(res.body.data).toHaveProperty('createdAt');
        });

        it('should return 400 if title or description is missing', async () => {
            const res = await request(server).post('/api/todos').send({ title: 'Missing Description' });
            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Title and description are required');
        });
    });

    describe('GET /todos/:id', () => {
        it('should retrieve a todo item by ID', async () => {
            const newTodo = {
                id: uuidv4(),
                title: 'Get By ID',
                description: 'Retrieve this todo by ID',
                completed: false,
                createdAt: new Date().toISOString(),
            };
            todos.push(newTodo);

            const res = await request(server).get(`/api/todos/${newTodo.id}`);
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toMatchObject(newTodo);
        });

        it('should return 404 for a non-existent ID', async () => {
            const res = await request(server).get(`/api/todos/${uuidv4()}`);
            expect(res.status).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('To-Do not found');
        });
    });

    describe('PUT /todos/:id', () => {
        it('should update an existing todo item', async () => {
            const newTodo = {
                id: uuidv4(),
                title: 'To Update',
                description: 'Update this todo',
                completed: false,
                createdAt: new Date().toISOString(),
            };
            todos.push(newTodo);

            const updatedData = { title: 'Updated Title', completed: true };
            const res = await request(server).put(`/api/todos/${newTodo.id}`).send(updatedData);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.title).toBe(updatedData.title);
            expect(res.body.data.completed).toBe(updatedData.completed);
        });

        it('should return 404 for a non-existent ID', async () => {
            const res = await request(server).put(`/api/todos/${uuidv4()}`).send({ title: 'Non-existent' });
            expect(res.status).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('To-Do not found');
        });
    });

    describe('DELETE /todos/:id', () => {
        it('should delete a todo item by ID', async () => {
            const newTodo = {
                id: uuidv4(),
                title: 'To Delete',
                description: 'Delete this todo',
                completed: false,
                createdAt: new Date().toISOString(),
            };
            todos.push(newTodo);

            const res = await request(server).delete(`/api/todos/${newTodo.id}`);
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe('To-Do deleted successfully');
        });

        it('should return 404 for a non-existent ID', async () => {
            const res = await request(server).delete(`/api/todos/${uuidv4()}`);
            expect(res.status).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('To-Do not found');
        });
    });
});
