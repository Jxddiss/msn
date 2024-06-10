import { AfterViewInit, Component, ComponentRef, ElementRef, HostListener, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef, ViewRef, signal } from '@angular/core';
import { MsnApp } from '../msn-app/msn-app.component';
import { Subscription } from 'rxjs';
import { WindowInfoService } from '../service/window-info.service';
import { NotificationComponent } from './notification/notification.component';

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
  msnOpened  = signal(false)
  template: TemplateRef<any> | undefined;
  componentsRefs : Record<string, ComponentRef<any> | undefined> = {}
  private _subscriptions : Subscription[] = []
  
  constructor(){ }

  ngOnInit(){
    
  }
    
  ngAfterViewInit(){
    this.onBackgroundChange()
    this.openMsn()
    for (let index = 0; index < 3; index++) {
      setTimeout(() => {
        this.onNotificationReceived(index)
      }, index*1000);
    }
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

  onNotificationReceived(index : number){
    if(this.notificationContainer === undefined) return
    const componentRef = this.notificationContainer?.createComponent(NotificationComponent)
    this.componentsRefs['notification-'+index] = componentRef
    if(componentRef){
      this._subscriptions.push(
        componentRef?.instance.close.subscribe(()=>this.onCloseNotification(index))
      )
    }
  }

  onCloseNotification(index : number){
    const componentRef = this.componentsRefs['notification-'+index]
    if(!componentRef) return
    const instance = componentRef.instance
    const indexNot = this.notificationContainer?.indexOf(componentRef.hostView)
    instance.disparition()
    setTimeout(()=>{
      this.notificationContainer?.remove(indexNot)
    }, 500)
    delete this.componentsRefs['notification-'+index]
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach(sub => sub.unsubscribe())
  }
}
