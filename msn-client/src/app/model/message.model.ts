export class Message {
    constructor(
        public id: number,
        public contenu: string,
        public date: Date,
        public nomSender: string,
        public type: string,
        public conversation: any,
        public style ?: string | null,
        public winkName?: string | null
    ){}
}
