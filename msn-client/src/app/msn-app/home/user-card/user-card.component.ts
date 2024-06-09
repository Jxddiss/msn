import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.css'
})
export class UserCardComponent {

  @ViewChild('avatarPicker') avatarPicker !: ElementRef
  @ViewChild('avatarImg') avatarImg !: ElementRef

  onChooseAvatar(){
    this.avatarPicker.nativeElement.click()
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
        alert(result);
        this.avatarPicker.nativeElement.value = '';
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
}
