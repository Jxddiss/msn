export class Notification {

    constructor(
        public id: number,
        public titre: string,
        public message: string,
        public date: Date,
        public type: string,
        public receveurId: number,
        public lu: boolean,
        public image ?: string,
        public lien ?: string
    ){}
}
