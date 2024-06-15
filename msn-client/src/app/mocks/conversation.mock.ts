import { Conversation } from "../model/conversation.model";
import { USERS } from "./utilisateurs.mock";

export const CONVERSATIONS = [
    new Conversation(1, [USERS[0], USERS[1]]),
    new Conversation(2, [USERS[2], USERS[0]]),
    new Conversation(3, [USERS[0], USERS[3]]),
    new Conversation(5, [USERS[0], USERS[5]]),
    new Conversation(6, [USERS[0], USERS[6]]),
    new Conversation(7, [USERS[0], USERS[7]]),
    new Conversation(8, [USERS[1], USERS[2]]),
    new Conversation(9, [USERS[1], USERS[3]]),
    new Conversation(10, [USERS[1], USERS[4]]),
]