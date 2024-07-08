import { Request, Response } from "express";
import { CreateTodoDto, UpdateTodoDto } from "../../domain/dto";

import { TodoRepository } from "../../domain";





export class TodosController {

    //* DI
    constructor(
        private readonly todoRepository: TodoRepository,
    ) { }

    


    public  getTodos = async (req: Request, res: Response) =>  {

     

        try {
            const todos = await this.todoRepository.getAll();
            return res.json(todos);
        } catch (error) {
            console.log(error)
            res.status(400).json({ error: error })
        }


    }

    public getTodoById = async (req: Request, res: Response) => {

        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: `ID argument is not a number` })
        try {
            const todo = await this.todoRepository.findById(id);
            return res.json(todo)
        } catch (error) {
            res.status(400).json({ error: error })
        };

    }


    public createTodo = async (req: Request, res: Response) => {

        const [error, createTodoDto] = CreateTodoDto.create(req.body);
        if (error) return res.status(400).json({ error: error });

        const todo = await this.todoRepository.create(createTodoDto!)
        res.json(todo);
    }


    public updateTodo = async (req: Request, res: Response) => {

        const id = +req.params.id;

        const [error, updateTodoDto] = UpdateTodoDto.update({
            ...req.body, id
        });
        if (error) return res.status(400).json({ error: error });

        const updatedTodo = await this.todoRepository.updateById(updateTodoDto!);

        res.json(updatedTodo);
    }

    public deleteTodo = async (req: Request, res: Response) => {

        const id = +req.params.id

        if (isNaN(id)) return res.status(400).json({ error: "ID argument is not a number" })

        const deletedTodo = await this.todoRepository.deleteById(id);

        res.json(deletedTodo);
    }

}