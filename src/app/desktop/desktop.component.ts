import { Component, ComponentRef, ElementRef, HostListener, TemplateRef, ViewChild, ViewContainerRef, signal } from '@angular/core';
import { MsnApp } from '../msn-app/msn-app.component';

@Component({
  selector: 'app-desktop',
  templateUrl: './desktop.component.html',
  styleUrl: './desktop.component.css'
})
export class DesktopComponent{
  @ViewChild('windowContainer',{read: ViewContainerRef})
  entry : ViewContainerRef | undefined;
  msnOpened  = false
  template: TemplateRef<any> | undefined;
  componentsRefs : Record<string, ComponentRef<any> | undefined> = {} 
  
  constructor(){}

  openMsn(){
    this.entry?.clear()
    const componentRef = this.entry?.createComponent(MsnApp);
    componentRef?.instance.close.subscribe(()=>{
      componentRef.instance.disparition()
      setTimeout(()=>this.onCloseWindow(), 500)
    })
    componentRef?.instance.minimize.subscribe(()=>componentRef?.instance.minimizeOrResume())
    this.componentsRefs['msn'] = componentRef
    this.msnOpened = true
  }

  onCloseWindow(){
    this.msnOpened = false
    this.entry?.clear()
    delete this.componentsRefs['msn']
  }

  onClickWindow(type : string){
    if(this.componentsRefs[type]){
      console.log(type)
      this.componentsRefs[type]?.instance.minimizeOrResume()
    }else{
      if(type == 'msn') this.openMsn()
    }
  }


}
