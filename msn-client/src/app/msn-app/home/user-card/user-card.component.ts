import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ErreurService } from '../../../service/erreur.service';
import { Erreur } from '../../../model/erreur.model';
import { verifyFile } from '../../../utils/input-verification.utils';
import { Utilisateur } from '../../../model/utilisateur.model';
import { AuthentificationService } from '../../../service/authentification.service';
import { Router } from '@angular/router';
import { WindowInfoService } from '../../../service/window-info.service';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.css'
})
export class UserCardComponent implements OnInit{

  @ViewChild('avatarPicker') avatarPicker !: ElementRef
  @ViewChild('avatarImg') avatarImg !: ElementRef
  @ViewChild('bannerPicker') bannerPicker !: ElementRef
  @Output() bannerChangeEvent = new EventEmitter<File>();
  loggedInUser : Utilisateur = {} as Utilisateur;

  constructor(
    private _erreurService : ErreurService,
    private _authentificationService : AuthentificationService,
    private _router : Router,
    private _windowInfoService : WindowInfoService
  ) { }

  ngOnInit(): void {
    if(this._authentificationService.loggedUser)
    this.loggedInUser = this._authentificationService.loggedUser;
  }

  onChooseAvatar(){
    this.avatarPicker.nativeElement.click()
  }

  onChooseBanner(){
    this.bannerPicker.nativeElement.click()
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
      }else{
        const erreur = new Erreur("avatar", result);
        this._erreurService.onErreursEvent(erreur);
        this.avatarPicker.nativeElement.value = '';
      }
    }
  }

  onBannerImgChange(event : Event){
    const target = event.target as HTMLInputElement;
    if (target && target.files && target.files.length > 0) {
      const file = target.files[0];
      let result = verifyFile(file);
      if(result === "bon"){
        this.bannerChangeEvent.emit(file);
      }else{
        const erreur = new Erreur("Upload d'image", result);
        this._erreurService.onErreursEvent(erreur);
        this.bannerPicker.nativeElement.value = '';
      }
    }
  }

  onStatutChange(event : Event){
    const target = event.target as HTMLInputElement;
    this.loggedInUser.statut = target.value;
  }

  onLogout(){
    this._authentificationService.logout();
    this._windowInfoService.onDisparition();
    this._windowInfoService.onChatWidowMinimizeOrResume();
    setTimeout(()=>{this._router.navigate(['/login'])},500)
  }
}
