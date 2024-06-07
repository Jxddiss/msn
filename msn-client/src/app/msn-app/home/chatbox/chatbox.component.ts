import { AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, OnInit, ViewChild, signal } from '@angular/core';
import { WindowInfoService } from '../../../service/window-info.service';
import gsap from 'gsap';

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrl: './chatbox.component.css'
})
export class ChatboxComponent implements OnInit,AfterViewInit, OnDestroy{
  @ViewChild('remoteVideo') remoteVideo : ElementRef | undefined
  @ViewChild('localVideo') localVideo : ElementRef | undefined
  private _videoShared = false
  private _gotRemoteVideo = false
  private _localStream : MediaStream | undefined
  private _isLoading = signal<boolean>(true)
  private _test : string | undefined
  private _isMinimized = false
  private _isFullScreen = false
  private _isVideoFullScreen = false
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
      if(this._isFullScreen){
        setTimeout(()=>this.makeFullScreen(),800)
      }
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
      minHeight: '0px',
      minWidth: '0px',
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
    tl.to('.second-window', {
      translate: '-50% -50%',
      top: '48%',
      left: '50%',
    },0)

    tl.to('.second-window .content-container', {
      width: '99vw',
      height: '85vh',
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
      translate: '-53% -50%',
    })
    tl.to('.second-window', {
      translate: '-50% -50%',
    })
    tl.to('.second-window', {
      translate: '-47% -50%',
    })
    tl.to('.second-window', {
      clearProps: 'translate',
    })
    tl.repeat(5)
    tl.duration(0.2)
    tl.yoyo(true)
  }

  onStartVideoShare(){
    this._videoShared = !this._videoShared
    this.getStream()
    this.growVideo()
  }

  getStream(){
    if(!this._videoShared){
      this._localStream?.getTracks().forEach(track => track.stop())
    }else{
      navigator.mediaDevices
        .getUserMedia({video:true,audio:true})
        .then((stream) => {
              if(this.localVideo === undefined || this.localVideo === null) return
              this._localStream = stream
              this.localVideo.nativeElement.srcObject = this._localStream
            })
    }
  }

  onVideoFullScreen(){
    if(!this._isFullScreen){
      this.onFullScreen()
    }
    const tl = gsap.timeline()
    if(!this._isVideoFullScreen){
      tl.set('.local-holder', {
        height: 'auto',
      },0)
      tl.to('.local-holder', {
        width: '600px',
        maxHeight: '350px',
      })
      tl.to('.chat-zone', {
        display: 'none',
      })
    }else{
      tl.to('.local-holder', {
        clearProps: true,
      })

      tl.to('.chat-zone', {
        clearProps: true,
      })
      this.growVideo()
    }
    tl.duration(0.2)
    this._isVideoFullScreen = !this._isVideoFullScreen
  }

  growVideo(){
    const tl = gsap.timeline()
    if(this._videoShared){
      tl.to('.local-holder', {
        height: 'auto',
      },0)
      tl.to('.local-holder', {
        width: '350px',
        maxHeight: '250px',
      })
    }else{
      tl.to('.local-holder', {
        width: '135px',
        height: '135px',
      })

      tl.to('.local-holder', {
        clearProps: true,
      })
    }
    tl.duration(0.2)
  }
  
  get isFullScreen(){
    return this._isFullScreen
  }

  get videoShared(){
    return this._videoShared
  }

  get gotRemoteVideo(){
    return this._gotRemoteVideo
  }
}
