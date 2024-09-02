import { Component, OnDestroy, OnInit } from '@angular/core';
import { WindowInfoService } from '../../../service/window-info.service';
import { Router } from '@angular/router';
import { AuthentificationService } from '../../../service/authentification.service';
import { ErreurService } from '../../../service/erreur.service';
import { Erreur } from '../../../model/erreur.model';
import { Subscription } from 'rxjs';
import { NotificationService } from '../../../service/notification.service';
import { Notification } from '../../../model/notification.model';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  canBeFullScreen = false
  private _subsciptions : Subscription[] = []

  constructor(
    private _windowInfoService : WindowInfoService, 
    private _router : Router,
    private _authentificationService : AuthentificationService,
    private _erreurService : ErreurService,
    private _notificationService : NotificationService
  ) { }

  ngOnInit(): void {
    if(this._authentificationService.isLoggedIn()) {
      this._router.navigate(['/home'])
    }
    this.onFullScreen()
  }

  onFullScreen(){
    this._windowInfoService.onCanBeFullScreen(this.canBeFullScreen)
  }

  onResetPassword(loginForm : any){
    this._subsciptions.push(
      this._authentificationService.resetPassword(loginForm.email).subscribe(
        {
          next : (reponse) => {
            const message = reponse.body.message
            const notification = new Notification(0,"mot de passe",message,new Date(),"msn",0,false)
            this._notificationService.sendInternalNotification(notification)
            this.onGoToLogin()
          },
          error : (erreur) => {
            const erreurAffichee = new Erreur(erreur.error.httpStatus ?? erreur.error.code,erreur.error.message)
            this._erreurService.onErreursEvent(erreurAffichee)
          }
        }
      )
    )
  }

  onGoToLogin(){
    this._windowInfoService.onDisparition()
    setTimeout(()=>{this._router.navigate(['/login'])},500)
  }

  ngOnDestroy(): void {
    this._subsciptions.forEach(sub => sub.unsubscribe())
  }
}
