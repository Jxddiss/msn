import { Injectable } from '@angular/core';
import { Utilisateur } from '../model/utilisateur.model';
import { USERS } from '../mocks/utilisateurs.mock';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

  constructor() { }

  login(utilisateur : Utilisateur) {
    return USERS.find(u => u.email === utilisateur.email && u.password === utilisateur.password)
  }

  addUserToLocalStorage(utilisateur : Utilisateur) {
    localStorage.setItem("utilisateur", JSON.stringify(utilisateur));
  }

  isLoggedIn() {
    return localStorage.getItem("utilisateur") !== null;
  }

  logout() {
    localStorage.removeItem("utilisateur");
  }

  get loggedUser() : Utilisateur | undefined {
    if(!this.isLoggedIn()) return undefined
    return JSON.parse(localStorage.getItem('utilisateur')!)
  }
}
