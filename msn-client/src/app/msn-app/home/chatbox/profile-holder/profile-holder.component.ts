import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import gsap from 'gsap';
import { Observable, Subscription } from 'rxjs';
import { Utilisateur } from '../../../../model/utilisateur.model';
import { AuthentificationService } from '../../../../service/authentification.service';

@Component({
  selector: 'app-profile-holder',
  templateUrl: './profile-holder.component.html',
  styleUrl: './profile-holder.component.css'
})
export class ProfileHolderComponent implements OnInit,OnDestroy{
  @ViewChild('remoteVideo') remoteVideo : ElementRef | undefined
  @ViewChild('localVideo') localVideo : ElementRef | undefined
  private _videoShared = false
  private _gotRemoteVideo = false
  private _isVideoFullScreen = false
  private _localStream : MediaStream | undefined
  @Output() videoFullScreen = new EventEmitter()
  @Input() fullScreen = false
  @Input() appelStarted !: Observable<any>
  @Input() utilisateurs : Utilisateur[] = []
  private _subscriptions : Subscription[] = []
  loggedUser : Utilisateur | undefined

  constructor(private _authentificationService : AuthentificationService) {}

  ngOnInit(): void {
    this._subscriptions.push(
      this.appelStarted.subscribe(()=>this.onStartVideoShare())
    )
    this.loggedUser = this._authentificationService.loggedUser
  }

  get videoShared(){
    return this._videoShared
  }

  get gotRemoteVideo(){
    return this._gotRemoteVideo
  }

  onStartVideoShare(){
    this._videoShared = !this._videoShared
    this.getStream()
  }

  getStream(){
    if(!this._videoShared){
      this._localStream?.getTracks().forEach(track => track.stop())
      if(this._isVideoFullScreen) this.MakeVideoFullScreen()
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
      tl.to('.chat-zone', {
        opacity: '0',
      })
      tl.to('.chat-zone', {
        display: 'none',
      })
      tl.to('.profiles-pictures-holder', {
        flexDirection: 'row',
      })
      tl.to('.user-pic-holder', {
        height: '100%',
        maxHeight: '100%'
      })
      tl.to('.content-card', {
        maxWidth: 'none',
      })
      tl.duration(0.2)
    }else{
      tl.to('.profiles-pictures-holder', {
        flexDirection: 'column',
        ease: 'power1.inOut',
      })
      tl.to('.chat-zone', {
        display: 'flex',
        opacity: '1',
      })
      tl.to('.chat-zone', {
        clearProps: true,
      })
      tl.to('.local-holder', {
        clearProps: true,
      })
      tl.to('.user-pic-holder', {
        clearProps: true,
      })
      tl.to('.content-card', {
        clearProps: true,
      })
      tl.duration(0)
    }
    this._isVideoFullScreen = !this._isVideoFullScreen
  }

  ngOnDestroy(): void {
    this._localStream?.getTracks().forEach(track => track.stop())
    this._subscriptions.forEach(sub => sub.unsubscribe())
  }
  
}
