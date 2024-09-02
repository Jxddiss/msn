import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { WindowInfoService } from '../../../service/window-info.service';
import { AuthentificationService } from '../../../service/authentification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ErreurService } from '../../../service/erreur.service';
import { Subscription } from 'rxjs';
import { verifyPassword } from '../../../utils/input-verification.utils';
import { Erreur } from '../../../model/erreur.model';
import { Notification } from '../../../model/notification.model';
import { NotificationService } from '../../../service/notification.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  canBeFullScreen = false
  private _subsciptions : Subscription[] = []
  private _token : string | null = null
  @ViewChild('showPassword') showPassword !: ElementRef
  @ViewChild('passwordElement') passwordElement !: ElementRef
  @ViewChild('confirmerElement') confirmerElement !: ElementRef

  constructor(
    private _windowInfoService : WindowInfoService, 
    private _router : Router,
    private _activatedRoute : ActivatedRoute,
    private _authentificationService : AuthentificationService,
    private _erreurService : ErreurService,
    private _notificationService : NotificationService
  ) { }

  ngOnInit(): void {
    if(this._authentificationService.isLoggedIn()) {
      this._router.navigate(['/home'])
    }
    this.onFullScreen()
    this._token = this._activatedRoute.snapshot.queryParamMap.get('token')
  }

  onFullScreen(){
    this._windowInfoService.onCanBeFullScreen(this.canBeFullScreen)
  }
  onChangePassword(loginForm : any){
    if(this._token === null){
      return
    }
    const password = loginForm.password
    const confirmer = loginForm.confirmer
    const result = verifyPassword(password, confirmer)
    if(result === "bon"){
      this._subsciptions.push(
        this._authentificationService.changePassword(this._token, password, confirmer).subscribe(
          {
            next : (response) => {
              const message = response.body.message
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
    }else{
      const erreur = new Erreur("Mot de passe invalide",result)
      this._erreurService.onErreursEvent(erreur)
    }
  }

  onGoToLogin(){
    this._windowInfoService.onDisparition()
    setTimeout(()=>{this._router.navigate(['/login'])},500)
  }

  onShowPassword(){
    if(this.showPassword.nativeElement.checked){
      this.passwordElement.nativeElement.type = "text"
      this.confirmerElement.nativeElement.type = "text"
    }else{
      this.passwordElement.nativeElement.type = "password"
      this.confirmerElement.nativeElement.type = "password"
    }
  }

  ngOnDestroy(): void {
    this._subsciptions.forEach(sub => sub.unsubscribe())
  }
}
