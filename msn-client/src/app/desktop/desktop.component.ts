import { AfterViewInit, Component, ComponentRef, ElementRef, HostListener, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef, signal } from '@angular/core';
import { MsnApp } from '../msn-app/msn-app.component';
import { Subscription } from 'rxjs';
import { WindowInfoService } from '../service/window-info.service';

@Component({
  selector: 'app-desktop',
  templateUrl: './desktop.component.html',
  styleUrl: './desktop.component.css'
})
export class DesktopComponent implements AfterViewInit, OnDestroy, OnInit{
  @ViewChild('windowContainer',{read: ViewContainerRef})
  entry : ViewContainerRef | undefined;
  @ViewChild('desktop') desktop : ElementRef | undefined
  msnOpened  = signal(false)
  template: TemplateRef<any> | undefined;
  componentsRefs : Record<string, ComponentRef<any> | undefined> = {}
  private _subscriptions : Subscription[] = []
  
  constructor(){ }

  ngOnInit(){}
    
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

  ngOnDestroy(): void {
    this._subscriptions.forEach(sub => sub.unsubscribe())
  }
}
