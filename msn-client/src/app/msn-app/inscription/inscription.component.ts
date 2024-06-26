import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { WindowInfoService } from '../../service/window-info.service';
import { Erreur } from '../../model/erreur.model';
import { ErreurService } from '../../service/erreur.service';
import { verifyFile } from '../../utils/input-verification.utils';
import { Router } from '@angular/router';
import { AuthentificationService } from '../../service/authentification.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Notification } from '../../model/notification.model';
import { NotificationService } from '../../service/notification.service';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrl: './inscription.component.css'
})
export class InscriptionComponent implements OnInit, OnDestroy {
  @ViewChild('avatarPicker') avatarPicker !: ElementRef
  @ViewChild('avatarImg') avatarImg !: ElementRef
  canBeFullScreen = false
  formData = {
    email : '',
    nom : '',
    password : '',
    confirm : '',
    avatar : null as File | null
  }
  private _subsciptions : Subscription[] = []

  constructor(
    private _windowInfoService : WindowInfoService,
    private _erreurService : ErreurService,
    private _router : Router,
    private _authentificationService : AuthentificationService,
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

  onChooseAvatar(){
    this.avatarPicker.nativeElement.click()
  }

  onAvatarImgChange(event : Event){
    const target = event.target as HTMLInputElement;
    if (target && target.files && target.files.length > 0) {
      const file = target.files[0];
      let result = verifyFile(file);
      if(result === "bon"){
        const reader = new FileReader();
        reader.onload = () => {
          this.avatarImg.nativeElement.src = reader.result as string;
        };
        reader.readAsDataURL(file);
        this.formData.avatar = file;
      }else{
        const erreur = new Erreur("Upload d'image", result);
        this._erreurService.onErreursEvent(erreur);
        this.avatarPicker.nativeElement.value = '';
      }
    }
  }

  onInscription(form : NgForm){
    if(!form.invalid){
      const pswdResult = this.validatePassword(this.formData.password, this.formData.confirm)
      if(pswdResult === "bon"){
        const formData = this._authentificationService
          .createInscriptionFormData(this.formData.email, this.formData.password, this.formData.nom, this.formData.avatar)
        this._subsciptions.push(
          this._authentificationService
            .inscription(formData)
            .subscribe({
              next : () => {
                const notif = new Notification(0,"Inscription reussie", "Vous pouvez maintenant vous connecter",new Date(),"info",0,false)
                this._notificationService.sendInternalNotification(notif)
                this.onGoToLogin()
              },
              error : (error) => {
                const erreur = new Erreur(error.error.httpStatus ?? error.error.code,error.error.message)
                this._erreurService.onErreursEvent(erreur)
                this.resetForm()
              }
            })
        )
      }else{
        const erreur = new Erreur("Mot de passe", pswdResult);
        this._erreurService.onErreursEvent(erreur);
        this.resetForm()
      }
    }else{
      const erreur = new Erreur("Formulaire", "Veuillez remplir tous les champs");
      this._erreurService.onErreursEvent(erreur);
      this.resetForm()
    }
  }

  validatePassword(password : string, confirm : string){
    const result = "Mot de passe invalide"
    if(password === confirm){
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      if(regex.test(password)){
        return "bon"
      }
      return "Mot de passe invalide : 8 caractères, une majuscule, un chiffre et un caractère special sont requis"
    }else{
      return "Les mots de passe ne sont pas identiques"
    }
  }

  onGoToLogin(){
    this._windowInfoService.onDisparition()
    setTimeout(()=>{this._router.navigate(['/login'])},500)
  }

  resetForm(){
    this.formData = {
      email : '',
      nom : '',
      password : '',
      confirm : '',
      avatar : null
    }
  }

  ngOnDestroy(): void {
    this._subsciptions.forEach(sub => sub.unsubscribe())
  }
}
