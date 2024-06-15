export class Message {
    constructor(
        public id: number,
        public contenu: string,
        public date: Date,
        public nomSender: string,
        public type: string,
        public idConversation: number,
        public style ?: string | null,
        public winkName?: string | null
    ){}
}
