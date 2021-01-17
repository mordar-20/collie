/** @format */

import { ICommandMethod, IWordMethod } from "./botMethod.interface";

export interface IBotMethodUser {
    use(command: string, method: ICommandMethod): void;
    listen(word: string, method: IWordMethod): void;
}
