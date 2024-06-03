import { Component, ElementRef, EventEmitter, HostBinding, OnDestroy, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import gsap from 'gsap';

@Component({
  selector: 'app-msn-app',
  templateUrl: './msn-app.component.html',
  styleUrl: './msn-app.component.css'
})
export class MsnApp implements OnInit, OnDestroy{
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

    gsap.to('.window',{display:'block',opacity:1,translateY:0,})
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
    })

    tl.to('.login-card',{
      opacity:1,
      ease:'power1',
    })

    tl.duration(1)
  }

  disparition() : void{
    const tl = gsap.timeline()

    tl.to('.login-card',{
      opacity:0,
    },0)

    tl.from('.login',{
      width: '500px',
      height: '450px',
    }).to('.login',{
      width: 0,
      height: 0,
      ease:'back',
    })

    tl.to('.window',{
      translateY:'100vh',
      opacity:0,
      display:'none'
    })

    tl.duration(0.7)
  }
}
