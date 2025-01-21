// Import required modules
const request = require('supertest');
const { v4: uuidv4 } = require('uuid');

// Import the app (assuming the app is exported from the main file)
const app = require('../app');
const port = process.env.PORT || 4000

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

    describe('GET /todos', () => {
        it('should return an empty list initially', async () => {
            const res = await request(server).get('/todos');
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual([]);
        });
    });

    describe('POST /todos', () => {
        it('should create a new todo item', async () => {
            const newTodo = {
                title: 'Test ToDo',
                description: 'This is a test todo item',
            };

            const res = await request(server)
                .post('/todos')
                .send(newTodo);

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toMatchObject(newTodo);
            expect(res.body.data).toHaveProperty('id');
            expect(res.body.data).toHaveProperty('createdAt');
        });

        it('should return 400 if title or description is missing', async () => {
            const res = await request(server).post('/todos').send({ title: 'Missing Description' });
            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Title and description are required');
        });
    });

    describe('GET /todos/:id', () => {
        it('should retrieve a todo item by ID', async () => {
            const newTodo = {
                title: 'Get By ID',
                description: 'Retrieve this todo by ID',
            };

            const created = await request(server).post('/todos').send(newTodo);
            const id = created.body.data.id;

            const res = await request(server).get(`/todos/${id}`);
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toMatchObject(newTodo);
        });

        it('should return 404 for a non-existent ID', async () => {
            const res = await request(server).get(`/todos/${uuidv4()}`);
            expect(res.status).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('ToDo not found');
        });
    });

    describe('PUT /todos/:id', () => {
        it('should update an existing todo item', async () => {
            const newTodo = {
                title: 'To Update',
                description: 'Update this todo',
            };

            const created = await request(server).post('/todos').send(newTodo);
            const id = created.body.data.id;

            const updatedData = { title: 'Updated Title', completed: true };
            const res = await request(server).put(`/todos/${id}`).send(updatedData);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.title).toBe(updatedData.title);
            expect(res.body.data.completed).toBe(updatedData.completed);
        });

        it('should return 404 for a non-existent ID', async () => {
            const res = await request(server).put(`/todos/${uuidv4()}`).send({ title: 'Non-existent' });
            expect(res.status).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('ToDo not found');
        });
    });

    describe('DELETE /todos/:id', () => {
        it('should delete a todo item by ID', async () => {
            const newTodo = {
                title: 'To Delete',
                description: 'Delete this todo',
            };

            const created = await request(server).post('/todos').send(newTodo);
            const id = created.body.data.id;

            const res = await request(server).delete(`/todos/${id}`);
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe('ToDo deleted successfully');
        });

        it('should return 404 for a non-existent ID', async () => {
            const res = await request(server).delete(`/todos/${uuidv4()}`);
            expect(res.status).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('ToDo not found');
        });
    });
});
