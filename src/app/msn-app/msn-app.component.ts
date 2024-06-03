import { Component, ElementRef, EventEmitter, HostBinding, OnDestroy, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import gsap from 'gsap';

@Component({
  selector: 'app-msn-app',
  templateUrl: './msn-app.component.html',
  styleUrl: './msn-app.component.css'
})
export class MsnApp implements OnDestroy{
  close = new EventEmitter();
  minimize = new EventEmitter();
  isMinimized = false
  @HostBinding('style.display') display = 'block'

  constructor(){
  }

  ngOnInit(){
    this.apparition()
  }
  
  onQuitWindow(){
    this.close.emit(null)
  }

  onMinimize(){
    this.minimize.emit(null)
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
  }

  apparition() : void{
    const tl = gsap.timeline()

    gsap.to('.window',{display:'block',opacity:1,})
    tl.from('.login',{
      height: 0,
      width:0,
      opacity:0,
    })

    tl.to('.login',{
      width: '500px',
      height: '450px',
      opacity:1,
      ease:'back',
    },0)

    tl.from('.login-card',{
      opacity:0,
      ease:'power1',
    })
  }

  disparition() : void{
    const tl = gsap.timeline()

    tl.to('.window',{
      opacity:0,
    },0).set('.window',{display:'none'})
  }
}
