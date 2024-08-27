import { AfterViewInit, Component, ComponentRef, ElementRef, HostListener, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef, signal } from '@angular/core';
import { MsnApp } from '../msn-app/msn-app.component';
import { Subscription } from 'rxjs';
import { NotificationComponent } from './notification/notification.component';
import { ErreurService } from '../service/erreur.service';
import { ErreurComponent } from './erreur/erreur.component';
import { Erreur } from '../model/erreur.model';
import { Wink } from '../model/wink.model';
import gsap from 'gsap';
import { WinksService } from '../service/winks.service';
import { NotificationService } from '../service/notification.service';
import { Notification } from '../model/notification.model';
import { BasicWindowComponent } from '../basic-window/basic-window.component';

@Component({
  selector: 'app-desktop',
  templateUrl: './desktop.component.html',
  styleUrl: './desktop.component.css'
})
export class DesktopComponent implements AfterViewInit, OnDestroy, OnInit{
  @ViewChild('windowContainer',{read: ViewContainerRef})
  entry : ViewContainerRef | undefined;
  @ViewChild('iframesContainer', {read : ViewContainerRef})
  iframesContainer : ViewContainerRef | undefined;
  @ViewChild('desktop') desktop : ElementRef | undefined
  @ViewChild('notificationContainer',{read: ViewContainerRef}) 
  notificationContainer : ViewContainerRef | undefined
  @ViewChild('erreurContainer',{read: ViewContainerRef})
  erreurContainer : ViewContainerRef | undefined
  @ViewChild('winkImg') winkImg !: ElementRef 
  private _winkIsPlaying = false
  msnOpened  = signal(false)
  iEOpened  = signal(false)
  tetrisOpened  = signal(false)
  codeOpened  = signal(false)
  template: TemplateRef<any> | undefined;
  componentsRefs : Record<string, ComponentRef<any> | undefined> = {}
  private _subscriptions : Subscription[] = []
  private _nbIeOpen = 0
  private _nbTetrisOpen = 0
  private _nbCodeOpen = 0
  private _nbBasicWindowOpen = 0
  
  
  constructor(
    private _erreurService : ErreurService, 
    private _winkservice : WinksService,
    private _notificationService : NotificationService,
  ){ 
    this._subscriptions.push(
      this._erreurService.erreursEvent$.subscribe((erreur)=>this.onErreurReceived(erreur))
    )

    this._subscriptions.push(
      this._winkservice.winksToPlay$.subscribe((wink)=>this.onPlayWink(wink))
    )
  }

  ngOnInit(){
    this._subscriptions.push(
      this._notificationService.notification$.subscribe((notification)=>{
        this.onNotificationReceived(notification)
      })
    )
  }
    
  ngAfterViewInit(){
    this.onBackgroundChange()
    this.openMsn()
  }

  openMsn(){
    this.onCloseWindow()
    const componentRef = this.entry?.createComponent(MsnApp);
    if(componentRef?.instance.close){
      this._subscriptions.push(
          componentRef?.instance.close.subscribe(()=>{
            componentRef.instance.disparition()
            setTimeout(()=>this.onCloseWindow(), 500)
        })
      )
    }
    this.componentsRefs['msn'] = componentRef
    this.msnOpened.set(true)
  }

  onOpenApp(type : string, iframeUrl : string, titre : string, canBeFullScreen : boolean = false){
    if(this._nbBasicWindowOpen >= 2) return
    if(this.iframesContainer === undefined) return
    this._nbBasicWindowOpen++
    const componentRef = this.iframesContainer.createComponent(BasicWindowComponent)
    componentRef.instance.iframeUrl = iframeUrl
    componentRef.instance.titre = titre
    componentRef.instance.canBeFullScreen = canBeFullScreen
    const index = this.iframesContainer?.indexOf(componentRef.hostView)
    
    type = type + '-' + index
    componentRef.instance.windowType = type
    this.componentsRefs[type] = componentRef

    if(componentRef){
      this._subscriptions.push(
        componentRef.instance.close.subscribe(()=>{
          this.onCloseBasicWindow(type)
        })
      )
    }

    if(type.includes('ie')){
      this.iEOpened.set(true)
      this._nbIeOpen++
    }

    if(type.includes('tetris')){
      this.tetrisOpened.set(true)
      this._nbTetrisOpen++
    }

    if(type.includes('code')){
      this.codeOpened.set(true)
      this._nbCodeOpen++
    }
  }

  onCloseWindow(){
    this.msnOpened.set(false)
    const componentRef = this.componentsRefs['msn']
    if(!componentRef) return
    const indexUpToDate = this.entry?.indexOf(componentRef.hostView)
    this.entry?.remove(indexUpToDate)
    delete this.componentsRefs['msn']
    this.entry?.clear()
  }

  onCloseBasicWindow(type : string){
    const componentRef = this.componentsRefs[type]
    if(!componentRef) return
    const instance = componentRef.instance
    const indexUpToDate = this.iframesContainer?.indexOf(componentRef.hostView)
    instance.disparition()
    delete this.componentsRefs[type]
    if (type.includes('ie')){
      this._nbIeOpen--
      if(this._nbIeOpen == 0){
        this.iEOpened.set(false)
      }
    }

    if(type.includes('tetris')){
      this._nbTetrisOpen--
      if(this._nbTetrisOpen == 0){
        this.tetrisOpened.set(false)
      }
    }

    if(type.includes('code')){
      this._nbCodeOpen--
      if(this._nbCodeOpen == 0){
        this.codeOpened.set(false)
      }
    }

    this._nbBasicWindowOpen--
    if(this._nbBasicWindowOpen <= 0){
      setTimeout(()=>{
        this.iframesContainer?.clear()
      },200)
    }else{
      this.iframesContainer?.remove(indexUpToDate)
    }
    
  }

  onClickWindow(type : string){
    if(this.componentsRefs[type]){
      this.componentsRefs[type]?.instance.minimizeOrResume()
    }else{
      if(type == 'msn') this.openMsn()
    }
  }

  onBackgroundChange(){
    if(localStorage.getItem('background')){
      if(this.desktop === undefined) return 
      this.desktop.nativeElement.style.backgroundImage = `url(${localStorage.getItem('background')})`
    }
  }

  onNotificationReceived(notification : Notification){
    if(this.notificationContainer === undefined) return
    const componentRef = this.notificationContainer?.createComponent(NotificationComponent)
    componentRef.instance.setNotification(notification)
    const index = this.notificationContainer?.indexOf(componentRef.hostView)
    this.componentsRefs['notification-'+index] = componentRef
    if(componentRef){
      this._subscriptions.push(
        componentRef.instance.close.subscribe(()=>this.onCloseNotification(index))
      )
    }
    
  }

  onCloseNotification(index : number){
    const componentRef = this.componentsRefs['notification-'+index]
    if(!componentRef) return
    const instance = componentRef.instance
    const indexUpToDate = this.notificationContainer?.indexOf(componentRef.hostView)
    instance.disparition()
    setTimeout(()=>{
      this.notificationContainer?.remove(indexUpToDate)
    }, 500)
    delete this.componentsRefs['notification-'+index]
  }

  onErreurReceived(erreur : Erreur){
    if(this.erreurContainer === undefined) return
    this.erreurContainer.clear()
    const componentRef = this.erreurContainer?.createComponent(ErreurComponent)
    componentRef.instance.erreur = erreur
    this._subscriptions.push(
      componentRef?.instance.close.subscribe(()=>this.erreurContainer?.clear())
    )
  }

  onPlayWink(wink : Wink){
    if(this._winkIsPlaying) return
    this.winkImg.nativeElement.src = wink.gif
    const tl = gsap.timeline()
    const audio = new Audio(wink.sound)
    audio.load()
    audio.play()
    tl.to('.wink-player', {
      display: 'flex',
      opacity: 1,
    })
    tl.to('.wink-player', {
      display: 'none',
      opacity: 0,
      delay: wink.duration
    })
    setTimeout(()=>{
      this.winkImg.nativeElement.src = ''
      this._winkIsPlaying = false
    }, wink.duration*1000 + 800)
  }

  onIEOpenEvent(){
    if(this.iEOpened()) {
      for (let index = 0; index <= this._nbBasicWindowOpen; index++) {
        const componentRef = this.componentsRefs['ie-'+index]
        if(componentRef){
          const instance = componentRef.instance
          instance.minimizeOrResume()
        }
      }
    }else{
      this.onOpenApp('ie', 'https://www.google.com/webhp?igu=1','Internet Explorer',true)
    }
  }

  onIECloseEvent(){
    if(this.iEOpened()) {
      this.closeBasicWindowEvent('ie-')
    }
  }

  onTetrisOpenEvent(){
    if(this.tetrisOpened()) {
      for (let index = 0; index <= this._nbBasicWindowOpen; index++) {
        const componentRef = this.componentsRefs['tetris-'+index]
        if(componentRef){
          const instance = componentRef.instance
          instance.minimizeOrResume()
        }
      }
    }else{
      this.onOpenApp('tetris', 'https://freehtml5games.org/games/tetris-cube/index.html','Tetris')
    }

    this._nbBasicWindowOpen ++
  }

  onTetrisCloseEvent(){
    if(this.tetrisOpened()) {
      this.closeBasicWindowEvent('tetris-')
    }
  }

  onCodeOpenEvent(){
    if(this.codeOpened()) {
      for (let index = 0; index <= this._nbBasicWindowOpen; index++) {
        const componentRef = this.componentsRefs['code-'+index]
        if(componentRef){
          const instance = componentRef.instance
          instance.minimizeOrResume()
        }
      }
    }else{
      this.onOpenApp('code', 'https://github1s.com/jxddiss/msn','Visual Studio Code',true)
    }
  }

  onCodeCloseEvent(){
    if(this.codeOpened()) {
      this.closeBasicWindowEvent('code-')
    }
  }

  closeBasicWindowEvent(genType : string){
    for (let index = 0; index <= this._nbBasicWindowOpen +1; index++) {
      this.onCloseBasicWindow(genType+index)
    }
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach(sub => sub.unsubscribe())
  }
}
