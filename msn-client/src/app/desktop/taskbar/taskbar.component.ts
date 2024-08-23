import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { WindowInfoService } from '../../service/window-info.service';
import { Subscription } from 'rxjs';
import { Erreur } from '../../model/erreur.model';
import { ErreurService } from '../../service/erreur.service';
import { verifyFile } from '../../utils/input-verification.utils';

@Component({
  selector: 'app-taskbar',
  templateUrl: './taskbar.component.html',
  styleUrl: './taskbar.component.css'
})
export class TaskbarComponent implements AfterViewInit, OnDestroy{
  @Input() msnOpened = false
  @Input() iEOpened = false
  @Input() tetrisOpened = false
  @Output() msnOpenEvent = new EventEmitter()
  @ViewChild('startMenu') startMenu : ElementRef | undefined
  @ViewChild('startIcon') startIcon : ElementRef | undefined
  @ViewChild('backgroundFile') backgroundFile : ElementRef | undefined
  @ViewChild('winProfileInput') winProfileInput : ElementRef | undefined
  @ViewChild('winProfileImg') winProfileImg !: ElementRef 
  startOpened = false
  currentDate = new Date();
  intervalDate = setInterval(() => {
    this.currentDate = new Date();
  }, 1000);
  chatOpened = false
  chatMinimized = false
  private _subcriptions : Subscription[] = []
  @Output() backgroundChangeEvent = new EventEmitter()
  @Output() iEOpenEvent = new EventEmitter()
  @Output() iECloseEvent = new EventEmitter()
  @Output() tetrisOpenEvent = new EventEmitter()
  @Output() tetrisCloseEvent = new EventEmitter()
  
  constructor(
    private _windowInfoService : WindowInfoService,
    private _erreurService : ErreurService){ 
    this._subcriptions.push(
      this._windowInfoService.chatWindowOpen$.subscribe(value => {
        this.chatOpened = value
      })
    )
  }

  ngAfterViewInit(): void {
    this.setWinProfileImg()
  }

  onMsnOpen(){
    this.msnOpenEvent.emit(null)
  }

  onIEOpen(){
    this.iEOpenEvent.emit(null)
  }

  onIEClose(){
    this.iECloseEvent.emit(null)
  }

  onTetrisOpen(){
    this.tetrisOpenEvent.emit(null)
  }

  onTetrisClose(){
    this.tetrisCloseEvent.emit(null)
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
      const result = verifyFile(file)
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

  onOpenWinProfile(){
    this.winProfileInput?.nativeElement.click()
  }

  onChangeWinProfile(){
    const file = this.winProfileInput?.nativeElement.files[0]
    if(file){
      const result = verifyFile(file)
      if(result === "bon"){
        const reader = new FileReader();
        reader.onload = () => {
          localStorage.setItem('profilewindows', reader.result as string)
          this.winProfileImg.nativeElement.src = reader.result as string
        };
        reader.readAsDataURL(file);
      }else{
        const erreur = new Erreur("Upload d'image", result);
        this._erreurService.onErreursEvent(erreur);
      }
    }
  }

  setWinProfileImg(){
    if(localStorage.getItem('profilewindows') === null) return
    this.winProfileImg.nativeElement.src = localStorage.getItem('profilewindows')
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalDate);
  }
}
