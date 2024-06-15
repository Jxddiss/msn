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
            this.avatar = 'assets/images/buddy2.png'
        }
        if(this.banniere === null || !this.banniere || this.banniere === '') {
            this.banniere = 'assets/images/default.png'
        }
        if(this.description === null || !this.description || this.description === '') {
            this.description = 'Hello'
        }
    }
}
