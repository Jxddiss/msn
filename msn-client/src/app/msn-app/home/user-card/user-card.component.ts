import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { ErreurService } from '../../../service/erreur.service';
import { Erreur } from '../../../model/erreur.model';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.css'
})
export class UserCardComponent {

  @ViewChild('avatarPicker') avatarPicker !: ElementRef
  @ViewChild('avatarImg') avatarImg !: ElementRef
  @ViewChild('bannerPicker') bannerPicker !: ElementRef
  @Output() bannerChangeEvent = new EventEmitter<File>();
  statut = 'online';

  constructor(private _erreurService : ErreurService) { }

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
      let result = this.verifyFile(file);
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
      let result = this.verifyFile(file);
      if(result === "bon"){
        this.bannerChangeEvent.emit(file);
      }else{
        const erreur = new Erreur("Upload d'image", result);
        this._erreurService.onErreursEvent(erreur);
        this.bannerPicker.nativeElement.value = '';
      }
    }
  }

  verifyFile(file: File) : string{ 
    if(file.type === 'image/png' 
    || file.type === 'image/jpg' 
    || file.type === 'image/jpeg' 
    || file.type === 'image/gif'){
      if(file.size < 5000000){
        return "bon"
      }else{
        return "Image trop lourde"
      }
    }

    return "Format d'image non supportée"
  }

  onStatutChange(event : Event){
    const target = event.target as HTMLInputElement;
    this.statut = target.value;
  }
}
