import { AfterViewInit, Component, EventEmitter, OnDestroy, ViewChild, ViewContainerRef } from '@angular/core';
import gsap from 'gsap';
import { WindowInfoService } from '../service/window-info.service';
import { ChatboxComponent } from './home/chatbox/chatbox.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-msn-app',
  templateUrl: './msn-app.component.html',
  styleUrl: './msn-app.component.css'
})
export class MsnApp implements AfterViewInit, OnDestroy{
  @ViewChild('secondWindowContainer', { read: ViewContainerRef }) 
  secondWindowContainer: ViewContainerRef | undefined;
  close = new EventEmitter();
  canBeFullScreen = false
  isMinimized = false
  private _subscription : Subscription[] = []

  constructor(private _windowInfoService : WindowInfoService) {
    this._subscription.push(
      this._windowInfoService.canBeFullScreen$.subscribe(value => {
        this.canBeFullScreen = value
      })
    )

    this._subscription.push(
      this._windowInfoService.homeWindowOpen$.subscribe(value => {
        console.log(value)
        if(value){
          this.initialiseChatBox()
        }
      })
    )
  }

  ngAfterViewInit(){
    this.apparition()
  }
  
  onQuitWindow(){
    this.close.emit(null)
  }

  minimizeOrResume(){
    if(this.isMinimized){
      this.isMinimized = false
      this.apparition('.msn-window')
    }else{
      this.disparition('.msn-window')
      this.isMinimized = true
    }
  }

  ngOnDestroy(){
    this._subscription.forEach(sub => sub.unsubscribe())
  }

  apparition(sel : string = '.window') : void{
    const tl = gsap.timeline()

    gsap.to(sel,{display:'block',opacity:1,})
    
    tl.from(sel+' .content-container',{
      height: 0,
      width:0,
      opacity:0,
    })

    tl.from(sel+' .content-card',{
      opacity:0,
    }).to(sel+' .content-card',{
      opacity:1,
    })
    tl.to(sel+" .content-container", {clearProps:true})
    tl.duration(1)
    
  }

  disparition(sel : string = '.window') : void{
    const tl = gsap.timeline()

    tl.to(sel+' .content-card',{
      opacity:0,
    },0)

    tl.to(sel+' .content-container',{
      width: '50px',
      height: '100px',
    })

    tl.to(sel,{display:'none',opacity:0,})
    tl.to(sel+" .content-container", {clearProps:true})

    tl.duration(0.2)
  }

  initialiseChatBox() {
    setTimeout(()=>{
      this.secondWindowContainer?.clear();
      const componentRef = this.secondWindowContainer?.createComponent(ChatboxComponent);
      componentRef?.instance.setTest('test');
    },0)
  }
}
