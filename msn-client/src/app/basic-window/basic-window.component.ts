import { AfterViewInit, Component, EventEmitter, } from '@angular/core';
import { WindowInfoService } from '../service/window-info.service';
import gsap from 'gsap';

@Component({
  selector: 'app-basic-window',
  templateUrl: './basic-window.component.html',
  styleUrl: './basic-window.component.css'
})
export class BasicWindowComponent implements AfterViewInit {
  iframeUrl : string = "";
  canBeFullScreen : boolean = false;
  windowType : string = "second";
  titre : string = "";
  close = new EventEmitter();
  private _isFullScreen = false
  isMinimized : boolean = false
  dragPosition = {
    x: 0,
    y: 0
  }
  private _lastPosition = {
    x: 0,
    y: 0
  }
  constructor(private _windowInfoService : WindowInfoService ) { }

  ngAfterViewInit(): void {
    this.apparition()
  }

  minimizeOrResume(){
    if(this.isMinimized){
      this.isMinimized = false
      this.apparition('.'+this.windowType)
    }else{
      this.disparition('.'+this.windowType)
      this.isMinimized = true
    }
  }

  onQuitWindow(){
    this.close.emit(null)
  }

  apparition(sel : string = '.'+this.windowType) : void{
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

  disparition(sel : string = '.'+this.windowType) : void{
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

  onFullScreen() : void{
    const tl = gsap.timeline()
    if(this._isFullScreen){
      tl.to('.'+this.windowType+' .content-container', {
        height: '600px',
        width: '800px',
      })
      tl.to('.'+this.windowType, {
        translate: '-50% -50%',
        top: '50%',
        left: '50%',
      },0)
      tl.set('.'+this.windowType, {clearProps:"translate"},0)
      tl.to('.second-window .content-container', {
        clearProps:true,
      })
      this.dragPosition = this._lastPosition
    }else{
      this.makeFullScreen()
    }
    tl.duration(0.2)
    this._isFullScreen = !this._isFullScreen
  }

  makeFullScreen() : void{
    this.resetDragPosition()
    const tl = gsap.timeline()
    tl.set('.'+this.windowType+' .content-container', {
      maxHeight: 'unset',
      maxWidth: 'unset',
    })
    tl.to('.'+this.windowType, {
      translate: '-50% -50%',
      top: '48%',
      left: '50%',
    },0)

    tl.to('.'+this.windowType+' .content-container', {
      width: '99dvw',
      height: '91dvh',
    })
    tl.duration(0.2)
  }

  resetDragPosition() : void{
    this.dragPosition = {
      x: 0,
      y: 0
    }
  }

  get isFullScreen(){
    return this._isFullScreen
  }
}
