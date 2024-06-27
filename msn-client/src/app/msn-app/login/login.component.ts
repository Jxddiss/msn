import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { WindowInfoService } from '../../service/window-info.service';
import { ErreurService } from '../../service/erreur.service';
import { AuthentificationService } from '../../service/authentification.service';
import { Utilisateur } from '../../model/utilisateur.model';
import { Router } from '@angular/router';
import { Erreur } from '../../model/erreur.model';
import { Subscription } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  @Output() canBeFullScreenEvent = new EventEmitter<boolean>()
  canBeFullScreen = false
  statut = 'online'
  private _subscriptions : Subscription[] = []

  constructor(private _windowInfoService : WindowInfoService, 
    private _erreurService : ErreurService,
    private _authentificationService : AuthentificationService,
    private router : Router) { }

  ngOnInit(): void {
    if(this._authentificationService.isLoggedIn()) {
      this.router.navigate(['/home'])
    }
    this.onFullScreen()
  }

  onFullScreen(){
    this._windowInfoService.onCanBeFullScreen(this.canBeFullScreen)
  }

  onLogin(utilisateur : Utilisateur){
    if(utilisateur.email === '' || utilisateur.password === ''){
      const erreur = new Erreur("Champs manquants",'Veuillez renseigner tous les champs')
      this._erreurService.onErreursEvent(erreur)
      return
    }
    this._subscriptions.push(
      this._authentificationService.login(utilisateur).subscribe({
          next: (response : HttpResponse<Utilisateur>) => {
            const token = response.headers.get("Jwt-Token");
            this._authentificationService.saveToken(token!);
            this._authentificationService.addUserToLocalStorage(response.body!)
            this._windowInfoService.onDisparition()
            this._authentificationService.configureWebsocket()
            setTimeout(()=>{this.router.navigate(['/home'])},500)
          },
          error: (error) => {
            const erreur = new Erreur(error.error.httpStatus ?? error.error.code,error.error.message)
            this._erreurService.onErreursEvent(erreur)
          }
      }
      )
    )
  }

  onGoInscription(){
    this._windowInfoService.onDisparition()
    setTimeout(()=>{this.router.navigate(['/inscription'])},500)
  }
}
