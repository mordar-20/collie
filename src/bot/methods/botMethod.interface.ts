/** @format */

import { Args } from "../args/args.class";

export interface ICommandMethod {
    /**
     * ```
     * args: new Args([
     *     {name: "url", optional: false}
     * ])
     * ```
     */
    command?: string;
    group?: string;
    args?: Args;
    method: Function;
    description: string;
}

export interface IWordMethod {
    word?: string;
    description: string;
    method: Function;
}
