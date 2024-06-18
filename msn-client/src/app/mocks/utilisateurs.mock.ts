import { Utilisateur } from "../model/utilisateur.model";

export const USERS : Utilisateur[] = [
    new Utilisateur(1, 'John Doe','john@example', 'online', null,'1','https://i.redd.it/windows-xp-user-icons-part-1-v0-21x236nw74qb1.jpg?width=1117&format=pjpg&auto=webp&s=373255f32cfaeaf801f1e3ae36dc314dd6b1f100','https://images.unsplash.com/photo-1506059837806-7de0cf7d4dc6?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
    new Utilisateur(2, 'Jane Smith','jane@example', 'absent', 'Hello, I am Jane Smith','1','https://pbs.twimg.com/media/DwPifW4X4AEVbGY.jpg',null),
    new Utilisateur(3, 'Jean Jacques','jean@example', 'inactif', 'Hello, I am Jean Jacques','1','https://robohash.org/3',null),
    new Utilisateur(4, 'Marie Smith','marie@example', 'disconnected', 'Hello, I am Marie Smith','1',null,null),
    new Utilisateur(5, 'Johny Martin','johnny@example', 'online', 'Hello, I am Johnny Martin','1','https://robohash.org/5',null),
    new Utilisateur(6, 'Martha Smith','john@example', 'online', 'Hello, I am Jane Smith','1',null,null),
    new Utilisateur(7, 'Emmanuel Jacques','john@example', 'inactif', 'Hello, I am Emmanuel','1','https://robohash.org/7',null),
    new Utilisateur(8, 'Ethan Smith','ethan@example', 'disconnected', 'Hello, I am Ethan Smith','1',null,null),
    new Utilisateur(9, 'test user','test@example', 'disconnected', 'test','1',null,null),
]