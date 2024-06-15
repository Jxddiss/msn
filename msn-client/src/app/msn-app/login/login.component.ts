import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { WindowInfoService } from '../../service/window-info.service';
import { ErreurService } from '../../service/erreur.service';
import { AuthentificationService } from '../../service/authentification.service';
import { Utilisateur } from '../../model/utilisateur.model';
import { Router } from '@angular/router';
import { Erreur } from '../../model/erreur.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  @Output() canBeFullScreenEvent = new EventEmitter<boolean>()
  canBeFullScreen = false

  constructor(private _windowInfoService : WindowInfoService, 
    private _erreurService : ErreurService,
    private _authentificationService : AuthentificationService,
    private router : Router) { }

  ngOnInit(): void {
    this.onFullScreen()
  }

  onFullScreen(){
    this._windowInfoService.onCanBeFullScreen(this.canBeFullScreen)
  }

  onLogin(utilisateur : Utilisateur){
    const user = this._authentificationService.login(utilisateur)
    if(user){
      this._authentificationService.addUserToLocalStorage(user)
      this.router.navigate(['/home'])
    }else{
      const erreur = new Erreur('Connexion','Login ou mot de passe incorrect')
      this._erreurService.onErreursEvent(erreur)
    }

  }
}
