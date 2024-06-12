import { Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { WindowInfoService } from '../../service/window-info.service';
import { Subscription, reduce } from 'rxjs';
import { Erreur } from '../../model/erreur.model';
import { ErreurService } from '../../service/erreur.service';

@Component({
  selector: 'app-taskbar',
  templateUrl: './taskbar.component.html',
  styleUrl: './taskbar.component.css'
})
export class TaskbarComponent implements OnDestroy{
  @Input() msnOpened = false
  @Output() msnOpenEvent = new EventEmitter()
  @ViewChild('startMenu') startMenu : ElementRef | undefined
  @ViewChild('startIcon') startIcon : ElementRef | undefined
  @ViewChild('backgroundFile') backgroundFile : ElementRef | undefined
  startOpened = false
  currentDate = new Date();
  intervalDate = setInterval(() => {
    this.currentDate = new Date();
  }, 1000);
  chatOpened = false
  chatMinimized = false
  private _subcriptions : Subscription[] = []
  @Output() backgroundChangeEvent = new EventEmitter()
  
  constructor(
    private _windowInfoService : WindowInfoService,
    private _erreurService : ErreurService){ 
    this._subcriptions.push(
      this._windowInfoService.chatWindowOpen$.subscribe(value => {
        this.chatOpened = value
      })
    )
  }

  onMsnOpen(){
    this.msnOpenEvent.emit(null)
  }

  onChatWinowOpen(){
    this._windowInfoService.onChatWidowMinimizeOrResume()
  }

  onOpenStartMenu(){
    this.startMenu?.nativeElement.classList.toggle('open')
    this.startIcon?.nativeElement.classList.toggle('start-icon-active')
    this.startOpened = !this.startOpened
  }

  @HostListener('document:click', ['$event']) onDocumentClick(event: MouseEvent) {
    if(!this.startMenu?.nativeElement.contains(event.target as Node) 
      && !this.startIcon?.nativeElement.contains(event.target as Node)){
      if(this.startOpened) this.onOpenStartMenu()
    }
  }

  onMsnClose(){
    this._windowInfoService.onMsnCloseEvent()
  }

  onOpenBackgroundSelector(){
    this.backgroundFile?.nativeElement.click()
  }

  onSetBackground(){
    const file = this.backgroundFile?.nativeElement.files[0]
    if(file){
      const result = this.verifyFile(file)
      if(result === "bon"){
        const reader = new FileReader();
        reader.onload = () => {
          localStorage.setItem('background', reader.result as string)
          this.backgroundChangeEvent.emit(null)
        };
        reader.readAsDataURL(file);
      }else{
        const erreur = new Erreur("Upload d'image", result);
        this._erreurService.onErreursEvent(erreur);
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

  ngOnDestroy(): void {
    clearInterval(this.intervalDate);
  }
}
