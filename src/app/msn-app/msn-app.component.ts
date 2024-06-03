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

    gsap.to('.window',{display:'block',opacity:1,})
    
    tl.from('.content-container',{
      height: 0,
      width:0,
      opacity:0,
    }).to('.content-container',{
      width: '500px',
      height: '450px',
      opacity:1,
      ease:'back',
    },0)

    tl.from('.content-card',{
      opacity:0,
    }).to('.content-card',{
      opacity:1,
      ease:'power1',
    })

    tl.duration(1)
  }

  disparition() : void{
    const tl = gsap.timeline()

    tl.to('.content-card',{
      opacity:0,
    },0)

    tl.from('.content-container',{
      width: '500px',
      height: '450px',
    }).to('.content-container',{
      width: 0,
      height: 0,
      ease:'back',
    })

    tl.to('.window',{display:'none',opacity:0,})

    tl.duration(0.7)
  }
}
