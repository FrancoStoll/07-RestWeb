





export class CreateTodoDto {


    private constructor(
        public readonly text: string,
    ) { }


    public static create(props: { [key: string]: any }): [string?, CreateTodoDto?] {

        const { text } = props;

        if (!text) return ['Text propery is required', undefined]

        const todo = new CreateTodoDto(text)

        return [undefined, todo]
    }

}