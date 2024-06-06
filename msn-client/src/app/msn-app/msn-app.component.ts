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
      this.apparition()
    }else{
      this.disparition()
      this.isMinimized = true
    }
    
  }

  ngOnDestroy(){
    this._subscription.forEach(sub => sub.unsubscribe())
  }

  apparition() : void{
    const tl = gsap.timeline()

    gsap.to('.window',{display:'block',opacity:1,})
    
    tl.from('.content-container',{
      height: 0,
      width:0,
      opacity:0,
    })

    tl.from('.content-card',{
      opacity:0,
    }).to('.content-card',{
      opacity:1,
    })
    tl.to(".content-container", {clearProps:true})
    tl.duration(1)
    
  }

  disparition() : void{
    const tl = gsap.timeline()

    tl.to('.content-card',{
      opacity:0,
    },0)

    tl.to('.content-container',{
      width: '50px',
      height: '100px',
    })

    tl.to('.window',{display:'none',opacity:0,})
    tl.to(".content-container", {clearProps:true})

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
