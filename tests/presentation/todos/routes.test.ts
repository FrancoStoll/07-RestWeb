import request from 'supertest';
import { testServer } from '../../test-server';
import { prisma } from '../../../src/data/postgres';




describe('routes.ts todos', () => {

    beforeAll(async () => {
        await testServer.start();
    });

    afterAll(async () => {
        testServer.close();

    });
    beforeEach(async () => {
        await prisma.todo.deleteMany();

    })

    const todo1 = { text: 'Hola mundo 1' }
    const todo2 = { text: 'Hola mundo 2' }

    test('should return TODOS api/todos', async () => {


        await prisma.todo.createMany({
            data: [todo1, todo2]
        })

        const { body } = await request(testServer.app)
            .get('/api/todos')
            .expect(200);

        expect(body).toBeInstanceOf(Array);
        expect(body.length).toBe(2);
        expect(body[0].text).toBe(todo1.text);
        expect(body[1].text).toBe(todo2.text);
    });


    test('should return a TODO api/todos/:id', async () => {


        const todo = await prisma.todo.create({
            data: todo1
        })


        const { body } = await request(testServer.app)
            .get(`/api/todos/${todo.id}`)
            .expect(200)

        expect(body).toEqual({
            text: todo.text,
            id: todo.id,
            completedAt: todo.completedAt
        });

    });


    test('should return a 404 NotFound api/todos/:id', async () => {

        const todoId = 9999
        const { body } = await request(testServer.app)
            .get(`/api/todos/${todoId}`)
            .expect(400);

        expect(body).toEqual({ error: `Todo with id ${todoId} not found` })
    });


    test('should return a new TODO api/todos', async () => {


        const { body } = await request(testServer.app)
            .post('/api/todos')
            .send(todo1)
            .expect(201);

        expect(body).toEqual({
            id: expect.any(Number),
            text: todo1.text,
            completedAt: null
        });

    })
    test('should return an error if text is not present api/todos', async () => {


        const { body } = await request(testServer.app)
            .post('/api/todos')
            .send({})
            .expect(400);

        expect(body).toEqual({ error: 'Text propery is required' })

    })

    test('should return an error if text is empty api/todos', async () => {


        const { body } = await request(testServer.app)
            .post('/api/todos')
            .send({ test: '' })
            .expect(400);

        expect(body).toEqual({ error: 'Text propery is required' })

    })


    test('should return an updated TODO api/todos/:id', async () => {

        const todo = await prisma.todo.create({ data: todo1 });


        const { body } = await request(testServer.app)
            .put(`/api/todos/${todo.id}`)
            .send({ text: 'hola mundo update', completedAt: '2023-10-21' })
            .expect(200);

        expect(body).toEqual({
            id: expect.any(Number),
            text: 'hola mundo update',
            completedAt: '2023-10-21T00:00:00.000Z'
        });

    });


    // TODO: Realizar la operacion con errores personalizados
    test('should return 404 if TODO not found', async () => {

        const todoId = 9999;

        const { body } = await request(testServer.app)
            .put(`/api/todos/${todoId}`)
            .send(todo1)
            .expect(404);


        expect(body).toEqual({ error: 'Todo with id 9999 not found' });

    });

    test('should return an updated TODO only the date', async () => {

        const todo = await prisma.todo.create({
            data: {
                text: 'update only date',
                completedAt: null,
            }
        })

        const { body } = await request(testServer.app)
            .put(`/api/todos/${todo.id}`)
            .send({ completedAt: '2023-10-21' })
            .expect(200);


        expect(body).toEqual({
            id: expect.any(Number),
            text: todo.text,
            completedAt: '2023-10-21T00:00:00.000Z'
        }
        );

    });

    test('should delete a TODO api/todos/:id', async () => {

        const todo = await prisma.todo.create({
            data: {
                text: 'delete todo',
                completedAt: null,
            }
        })

        const { body } = await request(testServer.app)
            .delete(`/api/todos/${todo.id}`)
            .expect(200);


        expect(body).toEqual({ id: expect.any(Number), text: todo.text, completedAt: null });



    });


    //TODO : CHANGE TO 404
    test('should return 404 if TODO do not exist api/todos/:id', async () => {

        const todoId = 99999
        const { body } = await request(testServer.app)
            .delete(`/api/todos/${todoId}`)
            .expect(400);

        console.log(body)
        expect(body).toEqual({ error: 'Todo with id 99999 not found' });

        

    });

});
