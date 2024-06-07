import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import gsap from 'gsap';

@Component({
  selector: 'app-profile-holder',
  templateUrl: './profile-holder.component.html',
  styleUrl: './profile-holder.component.css'
})
export class ProfileHolderComponent {
  @ViewChild('remoteVideo') remoteVideo : ElementRef | undefined
  @ViewChild('localVideo') localVideo : ElementRef | undefined
  private _videoShared = false
  private _gotRemoteVideo = false
  private _isVideoFullScreen = false
  private _localStream : MediaStream | undefined
  @Output() videoFullScreen = new EventEmitter()
  @Input() fullScreen = false


  get videoShared(){
    return this._videoShared
  }

  get gotRemoteVideo(){
    return this._gotRemoteVideo
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
    this.videoFullScreen.emit(null)
    this.MakeVideoFullScreen()
  }

  MakeVideoFullScreen(){
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
}
