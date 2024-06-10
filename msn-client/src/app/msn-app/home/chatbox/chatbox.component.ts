import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { WindowInfoService } from '../../../service/window-info.service';
import gsap from 'gsap';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrl: './chatbox.component.css'
})
export class ChatboxComponent implements OnInit,AfterViewInit, OnDestroy{
  private _isLoading = true
  private _test : string | undefined
  private _isMinimized = false
  private _isFullScreen = false
  private _subscriptions : Subscription[] = []
  private _appelEnCours = false
  private _appelStarted = new Subject()
  appelStarted$ = this._appelStarted.asObservable()

  dragPosition = {
    x: 0,
    y: 0
  }

  constructor(private _windowInfoService : WindowInfoService) {}

  ngOnInit(): void {
    this._windowInfoService.onChatWindowOpen(true)
    this._subscriptions.push(
      this._windowInfoService.chatWidowMinimizeOrResume$.subscribe(()=>this.minimizeOrResume())
    )
  }

  ngAfterViewInit(): void {
    this.positionAnimation()
  }

  ngOnDestroy(): void {
    this._windowInfoService.onChatWindowOpen(false)
    this._isMinimized = false
    this._isFullScreen = false
    this._subscriptions.forEach(sub => sub.unsubscribe())
  }

  positionAnimation() {
    const tl = gsap.timeline();
    tl.fromTo('.second-window', {
      left: '20%',
      opacity: 0,
    },{
      opacity: 1,
      left: '70%',
    })
  }

  setTest(value : string | undefined){
    this._test = value
    this._isLoading = false
  }

  get isLoading(){
    return this._isLoading
  }

  minimizeOrResume(){
    if(this._isMinimized){
      this.apparition()
      if(this._isFullScreen){
        setTimeout(()=>this.makeFullScreen(),850)
      }
    }else{
      this.disparition()
    }
    this._isMinimized = !this._isMinimized
  }

  apparition(){
    const tl = gsap.timeline()

    tl.to('.second-window',{display:'block',opacity:1,},0)
    
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
    tl.duration(0.5)
  }

  disparition() : void{
    const tl = gsap.timeline()

    tl.to('.second-window .content-card',{
      opacity:0,
    },0)

    tl.to('.second-window .content-container',{
      minHeight: '0px',
      minWidth: '0px',
    })

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
        width: '800px',
      })
      tl.to('.second-window', {
        translate: '-50% -50%',
        top: '50%',
        left: '50%',
      },0)
      tl.set(".second-window", {clearProps:"translate"},0)
      tl.to('.second-window .content-container', {
        clearProps:true,
      })
    }else{
      this.makeFullScreen()
    }
    tl.duration(0.2)
    this._isFullScreen = !this._isFullScreen
  }

  makeFullScreen() : void{
    this.resetDragPosition()
    const tl = gsap.timeline()
    tl.set('.second-window .content-container', {
      maxHeight: 'unset',
      maxWidth: 'unset',
    })
    tl.to('.second-window', {
      translate: '-50% -50%',
      top: '48%',
      left: '50%',
    },0)

    tl.to('.second-window .content-container', {
      width: '99dvw',
      height: '87dvh',
    })
    tl.duration(0.2)
  }

  resetDragPosition() : void{
    this.dragPosition = {
      x: 0,
      y: 0
    }
  }

  onNudge() : void{
    this.nudge()
  }

  nudge(){
    const audio = new Audio()
    audio.src = "assets/sounds/nudge.mp3"
    audio.load()
    audio.play()
    const tl = gsap.timeline()
    tl.to('.second-window', {
      translate: '-51% -51%',
    })
    tl.to('.second-window', {
      translate: '-50% -50%',
    })
    tl.to('.second-window', {
      translate: '-49% -49%',
    })
    tl.to('.second-window', {
      clearProps: 'translate',
    })
    tl.repeat(7)
    tl.duration(0.2)
    tl.yoyo(true)
  }

  onVideoFullScreenChange() : void{
    if(!this._isFullScreen){
      this.makeFullScreen()
      this._isFullScreen = true
    }
  }

  onAppelStarted() : void{
    this._appelEnCours = !this._appelEnCours
    this._appelStarted.next(null)
  }

  get isFullScreen(){
    return this._isFullScreen
  }

  get appelStarted(){
    return this.appelStarted$
  }
}
