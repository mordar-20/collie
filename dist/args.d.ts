/** @format */
export interface IArg {
    name: string;
    optional: boolean;
}
export declare class Args {
    args: IArg[];
    constructor(args: IArg[]);
    toString(): string;
}
