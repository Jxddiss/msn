import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { WindowInfoService } from '../../service/window-info.service';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrl: './inscription.component.css'
})
export class InscriptionComponent implements OnInit{
  @ViewChild('avatarPicker') avatarPicker !: ElementRef
  @ViewChild('avatarImg') avatarImg !: ElementRef
  canBeFullScreen = false

  constructor(private _windowInfoService : WindowInfoService) { }

  ngOnInit(): void {
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
      if(this.verifyFile(file)){
        const reader = new FileReader();
        reader.onload = () => {
          this.avatarImg.nativeElement.src = reader.result as string;
        };
        reader.readAsDataURL(file);
      }else{
        alert('Le format du fichier n\'est pas supporté');
        this.avatarPicker.nativeElement.value = '';
      }
    }
  }

  verifyFile(file: File) : boolean{ 
    if(file.type === 'image/png' 
    || file.type === 'image/jpg' 
    || file.type === 'image/jpeg' 
    || file.type === 'image/gif'){
      return true
    }

    return false
  }
}
