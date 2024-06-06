import { AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, OnInit, ViewChild, signal } from '@angular/core';
import { WindowInfoService } from '../../../service/window-info.service';
import gsap from 'gsap';

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrl: './chatbox.component.css'
})
export class ChatboxComponent implements OnInit,AfterViewInit, OnDestroy{
  private _isLoading = signal<boolean>(true)
  private _test : string | undefined
  private _isMinimized = false
  private _isFullScreen = false
  dragPosition = {
    x: 0,
    y: 0
  }

  constructor(private _windowInfoService : WindowInfoService) { 
    this._windowInfoService.chatWidowMinimizeOrResume$.subscribe(()=>this.minimizeOrResume())
  }

  ngOnInit(): void {
    this._windowInfoService.onChatWindowOpen(true)
  }

  ngAfterViewInit(): void {
    this.positionAnimation()
  }

  ngOnDestroy(): void {
    this._windowInfoService.onChatWindowOpen(false)
  }

  positionAnimation() {
    const tl = gsap.timeline();
    tl.to('.second-window', {
      left: '70%',
    })
  }

  setTest(value : string | undefined){
    this._test = value
    this._isLoading.set(false)
  }

  get isLoading(){
    return this._isLoading()
  }

  minimizeOrResume(){
    if(this._isMinimized){
      this._isMinimized = false
      this.apparition()
    }else{
      this.disparition()
      this._isMinimized = true
    }
  }

  apparition() : void{
    const tl = gsap.timeline()

    gsap.to('.second-window',{display:'block',opacity:1,})
    
    tl.from('.second-window .content-container',{
      height: 0,
      width:0,
      opacity:0,
    })

    tl.from('.second-window .content-card',{
      opacity:0,
    }).to('.second-window .content-card',{
      opacity:1,
    })
    tl.to(".second-window .content-container", {clearProps:true})
    tl.duration(1)
    
  }

  disparition() : void{
    const tl = gsap.timeline()

    tl.to('.second-window .content-card',{
      opacity:0,
    },0)

    tl.to('.second-window .content-container',{
      width: '50px',
      height: '100px',
    })

    tl.to('.second-window',{display:'none',opacity:0,})
    tl.to(".second-window .content-container", {clearProps:true})

    tl.duration(0.2)
  }

  onFullScreen() : void{
    const tl = gsap.timeline()
    if(this._isFullScreen){
      tl.to('.second-window .content-container', {
        height: '600px',
        width: '750px',
      })

      tl.to('.second-window', {
        translate: '-50% -50%',
        top: '50%',
        left: '50%',
      },0)
      tl.set(".second-window", {clearProps:"translate"},0)
    }else{
      this.resetDragPosition()
      tl.to('.second-window', {
        translate: '-50% -50%',
        top: '48%',
        left: '50%',
      },0)
  
      tl.to('.second-window .content-container', {
        width: '99vw',
        height: '85vh',
      })
    }
    tl.duration(0.2)
    this._isFullScreen = !this._isFullScreen
  }

  resetDragPosition() : void{
    this.dragPosition = {
      x: 0,
      y: 0
    }
  }
}
