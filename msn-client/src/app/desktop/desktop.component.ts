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
import { RxStompService } from '../service/rx-stomp.service';
import { AuthentificationService } from '../service/authentification.service';


@Component({
  selector: 'app-desktop',
  templateUrl: './desktop.component.html',
  styleUrl: './desktop.component.css'
})
export class DesktopComponent implements AfterViewInit, OnDestroy, OnInit{
  @ViewChild('windowContainer',{read: ViewContainerRef})
  entry : ViewContainerRef | undefined;
  @ViewChild('desktop') desktop : ElementRef | undefined
  @ViewChild('notificationContainer',{read: ViewContainerRef}) 
  notificationContainer : ViewContainerRef | undefined
  @ViewChild('erreurContainer',{read: ViewContainerRef})
  erreurContainer : ViewContainerRef | undefined
  @ViewChild('winkImg') winkImg !: ElementRef 
  private _winkIsPlaying = false
  msnOpened  = signal(false)
  template: TemplateRef<any> | undefined;
  componentsRefs : Record<string, ComponentRef<any> | undefined> = {}
  private _subscriptions : Subscription[] = []
  
  
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
    this.entry?.clear()
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

  onCloseWindow(){
    this.msnOpened.set(false)
    this.entry?.clear()
    delete this.componentsRefs['msn']
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

  ngOnDestroy(): void {
    this._subscriptions.forEach(sub => sub.unsubscribe())
  }
}
