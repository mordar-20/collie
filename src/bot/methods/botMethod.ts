/** @format */

import { Args } from "../args/args";

export interface BotMethod {
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
