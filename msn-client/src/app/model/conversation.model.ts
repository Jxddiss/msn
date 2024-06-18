import { Message } from "./message.model";
import { Utilisateur } from "./utilisateur.model";

export class Conversation {
    constructor(
        public id: number,
        public utilisateurs: Utilisateur[],
    ){}
}
