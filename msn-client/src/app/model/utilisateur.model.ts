export class Utilisateur {
    constructor(
        public id: number, 
        public nomComplet: string, 
        public email : string,
        public statut: string,
        public description: string | null,
        public password : string, // pour mock seulement
        public avatar: string | null,
        public banniere: string | null 
    ) {
        if(this.avatar === null || !this.avatar || this.avatar === '' ) {
            this.avatar = 'assets/images/buddy2.jpg'
        }
        if(!this.banniere) {
            this.banniere = 'assets/images/default.png'
        }
    }
}
