/** @format */

export interface IArg {
    name: string;
    optional: boolean;
}

export class Args {
    args: IArg[];

    constructor(args: IArg[]) {
        this.args = args;
    }

    public toString(): string {
        let string = "";
        this.args.forEach((arg) => {
            string += arg.optional ? `${arg.name}?` : arg.name;
            if (this.args.length - 1 != this.args.indexOf(arg)) string += ", ";
        });

        string = "[" + string + "]";

        return string;
    }
}
