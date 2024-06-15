export class Message {
    constructor(
        public id: number,
        public contenu: string,
        public date: Date,
        public nomSender: string,
        public type: string,
        public idConversation: number,
        public winkName?: string | null
    ){}
}
