/** @format */

import { BotMethod } from "./botMethod";

export interface BotMethodUser {
    use(command: string, method: BotMethod): void;
}
