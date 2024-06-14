export class Utilisateur {
    constructor(
        public id: number, 
        public nomComplet: string, 
        public email : string,
        public statut: string,
        public description: string | null,
        public password : string, // pour mock seulement
        public avatar: string | null = avatar != null && avatar ? avatar : 'assets/images/buddy2.png',
    ) {}
}
