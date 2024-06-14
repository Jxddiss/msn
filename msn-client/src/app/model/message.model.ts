export class Message {
    constructor(
        public id: number,
        public contenu: string,
        public date: Date,
        public pseudoSender: string,
        public type: string,
        public winkName: string
    ){}
}
