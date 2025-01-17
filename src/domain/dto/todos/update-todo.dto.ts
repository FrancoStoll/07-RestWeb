




export class UpdateTodoDto {



    private constructor(
        public readonly id: number,
        public readonly text?: string,
        public readonly completedAt?: string,
    ) { }

    get values() {
        const returnObj: { [key: string]: any } = {};

        if (this.text) returnObj.text = this.text;
        if (this.completedAt) returnObj.completedAt = this.completedAt;

        return returnObj;
    }

    public static update(props: { [key: string]: any }): [string?, UpdateTodoDto?] {

        const { id, text, completedAt } = props

        if (!id || isNaN(Number(id))) {
            return ['id must be a valid number', undefined];
        }

        let newCompletedAt = completedAt;

        if (completedAt) {
            newCompletedAt = new Date(newCompletedAt)
            if (newCompletedAt.toString() === 'Invalid Date') {
                return ['CompletedAt must be a valid date', undefined]
            };
        }

        return [undefined, new UpdateTodoDto(id, text, newCompletedAt)]
    }

}