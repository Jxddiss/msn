export class Utilisateur {
    constructor(
        public id: number, 
        public nomComplet: string, 
        public email : string,
        public statut: string,
        public description: string,
        public password : string, // pour mock seulement
        public avatar: string = 'assets/images/buddy2.png',
    ) {}
}
