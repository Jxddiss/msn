import { Utilisateur } from "./utilisateur.model";

export class Demande {

    constructor(
        public id: number,
        public receveur : Utilisateur,
        public envoyeur : Utilisateur,
        public statut : string,
        public accepter : Boolean
    ) { }
}
