import { Request, Response } from "express";
import { CreateTodoDto, UpdateTodoDto } from "../../domain/dto";
import { prisma } from "../../data/postgres";

const todos = [
    { id: 1, text: 'buy milk', completeAt: new Date() },
    { id: 2, text: 'buy bread', completeAt: null },
    { id: 3, text: 'buy butter', completeAt: new Date() },
]

export class TodosController {

    //* DI
    constructor() { }


    public async getTodos(req: Request, res: Response) {

        const todos = await prisma.todo.findMany();

        return res.json(todos);
    }

    public getTodoById = async (req: Request, res: Response) => {

        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: `ID argument is not a number` })
        const todo = await prisma.todo.findFirst({
            where: { id: id }
        });

        (todo)
            ? res.json(todo)
            : res.status(404).json({ error: `TODO with id ${id} not found` });
    }


    public createTodo = async (req: Request, res: Response) => {

        const [error, createTodoDto] = CreateTodoDto.create(req.body);
        if (error) return res.status(400).json({ error: error })

        const todo = await prisma.todo.create({
            data: createTodoDto!,
        })

        res.json(todo);
    }


    public updateTodo = async (req: Request, res: Response) => {

        const id = +req.params.id;

        const [error, updateTodoDto] = UpdateTodoDto.update({
            ...req.body, id
        });
        if (error) return res.status(400).json({ error: error });

        const todo = await prisma.todo.findFirst({
            where: { id: updateTodoDto?.id }
        })

        if (!todo) return res.status(404).json({ error: `Todo with id ${id} not found` });

        const updatedTodo = await prisma.todo.update({
            where: { id: updateTodoDto!.id },
            data: updateTodoDto!.values
        });

        res.json(updatedTodo);
    }

    public deleteTodo = async (req: Request, res: Response) => {

        const id = +req.params.id

        if (isNaN(id)) return res.status(400).json({ error: "ID argument is not a number" })

        const todo = await prisma.todo.findFirst({ where: { id: id } })
        if (!todo) return res.status(404).json({ error: `Todo with id ${id} not found` })

        const deletedTodo = await prisma.todo.delete({
            where: {
                id: id
            }
        });

        res.json(deletedTodo);
    }

}