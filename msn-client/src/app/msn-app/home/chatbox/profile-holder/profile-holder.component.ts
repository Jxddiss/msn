import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import gsap from 'gsap';
import { Observable, Subscription } from 'rxjs';
import { Utilisateur } from '../../../../model/utilisateur.model';
import { AuthentificationService } from '../../../../service/authentification.service';
import { NotificationService } from '../../../../service/notification.service';
import { Notification } from '../../../../model/notification.model';
import { RxStompService } from '../../../../service/rx-stomp.service';
import { Message } from '../../../../model/message.model';
import { peerConnectionConfig } from '../../../../constants/video.constant';

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
  @Input() conversationId !: number
  private _subscriptions : Subscription[] = []
  private _videoSubscriptions : Subscription[] = []
  loggedUser : Utilisateur | undefined
  private _localPeer : RTCPeerConnection | undefined
  private _otherUserId : number = 0
  

  constructor(
    private _authentificationService : AuthentificationService,
    private _notificationService : NotificationService,
    private _rxStompService : RxStompService
  ) {}

  ngOnInit(): void {
    this._subscriptions.push(
      this.appelStarted.subscribe(()=>this.onStartVideoShare())
    )
    this.loggedUser = this._authentificationService.loggedUser
    this._otherUserId = this.utilisateurs[0].id === this.loggedUser?.id ? this.utilisateurs[1].id : this.utilisateurs[0].id
    window.onbeforeunload = () => this.ngOnDestroy();
  }

  get videoShared(){
    return this._videoShared
  }

  get gotRemoteVideo(){
    return this._gotRemoteVideo
  }

  onStartVideoShare(){
    this._videoShared = !this._videoShared
    if(this._videoShared){
      this._localPeer = new RTCPeerConnection(peerConnectionConfig)
      this.getStream()
      const notif = new Notification(0,this.loggedUser?.nomComplet ?? "Utilisateur",
        "a commencé à partager sa caméra",new Date(),"msn",
        this._otherUserId,false,this.loggedUser?.avatar ?? undefined)
      this._notificationService.sendNotification(notif)
      const message = new Message(0,'',new Date(),this.loggedUser?.nomComplet ?? "Utilisateur",'video',{id:this.conversationId})
      this._rxStompService.publish({
        destination: '/app/chat/' + this.conversationId,
        body: JSON.stringify(message)
      })
    }else{
      this._rxStompService.publish({
        destination: '/app/chat/appel/remove/' + this.conversationId,
        body: JSON.stringify({toUser: this._otherUserId,fromUser: this.loggedUser?.id})
      })
    }
  }

  joinOrStartVideoCall(){
    this._rxStompService.publish({
      destination: '/app/chat/appel/call/' + this.conversationId + '/' + this._otherUserId,
      body: this.loggedUser?.id.toString()
    })
  }

  setUpVideoSubscriptions(){
    this._videoSubscriptions.push(
      this._rxStompService.watch('/topic/appel/call/' + this.conversationId + '/' + this.loggedUser?.id).subscribe({
        next:()=>{
          if(!this._localPeer) return
          this.setupPeerConnection()
          this._localPeer.createOffer().then((description) => {
            if(!this._localPeer) return
            this._localPeer.setLocalDescription(description)
            this._rxStompService.publish({
              destination: '/app/chat/appel/offer/' + this.conversationId + '/' + this._otherUserId,
              body: JSON.stringify({
                toUser: this._otherUserId,
                fromUser: this.loggedUser?.id,
                offer: description
              })
            })
          })
          console.log("tracks offer" + this._localPeer.getSenders().length)
        }
      })
    )

    this._videoSubscriptions.push(
      this._rxStompService.watch('/topic/appel/offer/' + this.conversationId + '/' + this.loggedUser?.id).subscribe({
        next:(response) => {
          if(!this._localPeer) return
          this._gotRemoteVideo = true
          this.setupPeerConnection()
          const offer = JSON.parse(response.body)['offer']
          this._localPeer.setRemoteDescription(new RTCSessionDescription(offer))
          this._localPeer.createAnswer().then((description) => {
            if(!this._localPeer) return
            this._localPeer.setLocalDescription(description)
            this._rxStompService.publish({
              destination: '/app/chat/appel/answer/' + this.conversationId + '/' + this._otherUserId,
              body: JSON.stringify({
                toUser: this._otherUserId,
                fromUser: this.loggedUser?.id,
                answer: description
              })
            })
          })
          console.log("tracks answer" + this._localPeer.getSenders().length)
        },
        error:(error)=>console.log(error)
      })
    )

    this._videoSubscriptions.push(
      this._rxStompService.watch('/topic/appel/candidate/' + this.conversationId + '/' + this.loggedUser?.id).subscribe({
        next:(response) => {
          if(!this._localPeer) return
          const candidate = JSON.parse(response.body)['candidate']
          const candidateObj = new RTCIceCandidate({
            sdpMLineIndex: candidate.label,
            candidate: candidate.id
          })
          this._localPeer.addIceCandidate(candidateObj)
        },
        error:(error)=>console.log(error)
      })
    )

    this._videoSubscriptions.push(
      this._rxStompService.watch('/topic/appel/answer/' + this.conversationId + '/' + this.loggedUser?.id).subscribe({
        next:(response) => {
          this._gotRemoteVideo = true
          const answer = JSON.parse(response.body)['answer']
          this._localPeer?.setRemoteDescription(new RTCSessionDescription(answer))
        },
        error:(error)=>console.log(error)
      })
    )
    this._subscriptions.push(
      this._rxStompService.watch('/topic/appel/remove/' + this.conversationId).subscribe({
        next:() => {
          this.resetPeerConnection()
        },
        error:(error)=>console.log(error)
      })
    )
  }

  setupPeerConnection(){
    console.log("set up peer connection local stream " + this._localStream) 
    if(!this._localPeer) return
    this._localPeer.ontrack = (event) => {
      if(this.remoteVideo === undefined || this.remoteVideo === null) return
      this.remoteVideo.nativeElement.srcObject = event.streams[0]
    }

    this._localStream?.getTracks().forEach(track => this._localPeer?.addTrack(track, this._localStream!))

    this._localPeer.onicecandidate = (event) => {
      if(event.candidate){
        let candidate = {
          type: 'candidate',
          label: event.candidate.sdpMLineIndex,
          id: event.candidate.candidate,
        }
        this._rxStompService.publish({
          destination: '/app/chat/appel/candidate/' + this.conversationId + '/' + this._otherUserId,
          body: JSON.stringify({
            toUser: this._otherUserId,
            fromUser: this.loggedUser?.id,
            candidate: candidate
          })
        })
      }
    }
    
  }

  getStream(){
    navigator.mediaDevices
      .getUserMedia({video:true,audio:true})
      .then((stream) => {
            if(this.localVideo === undefined || this.localVideo === null) return
            this._localStream = stream
            this.localVideo.nativeElement.srcObject = this._localStream 
            this.setUpVideoSubscriptions()
            this.joinOrStartVideoCall()
          })
  }

  resetPeerConnection(){
    this._gotRemoteVideo = false
    this._videoShared = false
    this._localPeer?.close()
    this._localPeer = undefined
    this._localStream?.getTracks().forEach(track => track.stop())
    if(this._isVideoFullScreen) this.MakeVideoFullScreen()
    if(this.remoteVideo !== undefined && this.remoteVideo !== null){
      this.remoteVideo.nativeElement.srcObject = null
    }
    if(this.localVideo !== undefined && this.localVideo !== null){
      this.localVideo.nativeElement.srcObject = null
    }
    this._videoSubscriptions.forEach(sub => sub.unsubscribe())
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
    this._subscriptions.forEach(sub => sub.unsubscribe())
    this.resetPeerConnection()
    this._videoShared = false
  }
  
}
