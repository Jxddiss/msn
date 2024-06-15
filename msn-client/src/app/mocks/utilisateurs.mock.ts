import { Utilisateur } from "../model/utilisateur.model";

export const USERS : Utilisateur[] = [
    new Utilisateur(1, 'John Doe','john@example', 'online', null,'1',null,null),
    new Utilisateur(2, 'Jane Smith','jane@example', 'absent', 'Hello, I am Jane Smith','1',null,null),
    new Utilisateur(3, 'Jean Jacques','jean@example', 'inactif', 'Hello, I am Jean Jacques','1',null,null),
    new Utilisateur(4, 'Marie Smith','marie@example', 'disconnected', 'Hello, I am Marie Smith','1',null,null),
    new Utilisateur(5, 'Johny Martin','johnny@example', 'online', 'Hello, I am Johnny Martin','1',null,null),
    new Utilisateur(6, 'Martha Smith','john@example', 'absent', 'Hello, I am Jane Smith','1',null,null),
    new Utilisateur(7, 'Emmanuel Jacques','john@example', 'inactif', 'Hello, I am Emmanuel','1',null,null),
    new Utilisateur(8, 'Ethan Smith','john@example', 'disconnected', 'Hello, I am Ethan Smith','1',null,null),
]