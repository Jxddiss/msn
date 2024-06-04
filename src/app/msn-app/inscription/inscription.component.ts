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
      const reader = new FileReader();
      reader.onload = () => {
        this.avatarImg.nativeElement.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
}
