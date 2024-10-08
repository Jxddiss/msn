import { AfterContentChecked, AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { WindowInfoService } from '../../../service/window-info.service';
import gsap from 'gsap';
import { Subject, Subscription } from 'rxjs';
import {parseEmoji} from '../../../utils/emoji.utils'
import { WinksService } from '../../../service/winks.service';
import { getWink } from '../../../utils/wink.utils';
import { verifyFile } from '../../../utils/input-verification.utils';
import { Erreur } from '../../../model/erreur.model';
import { ErreurService } from '../../../service/erreur.service';
import { Conversation } from '../../../model/conversation.model';
import { Utilisateur } from '../../../model/utilisateur.model';
import { Message } from '../../../model/message.model';
import { MessageService } from '../../../service/message.service';
import { ConversationService } from '../../../service/conversation.service';
import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { RxStompService } from '../../../service/rx-stomp.service';
import { Notification } from '../../../model/notification.model';
import { NotificationService } from '../../../service/notification.service';

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrl: './chatbox.component.css'
})
export class ChatboxComponent implements OnInit,AfterViewInit, OnDestroy, AfterContentChecked{
  private _isLoading = true
  private _conversation !: Conversation
  private _isMinimized = false
  private _isFullScreen = false
  private _subscriptions : Subscription[] = []
  private _appelEnCours = false
  private _appelStarted = new Subject()
  appelStarted$ = this._appelStarted.asObservable()
  private _emojiPickerOpen = new Subject()
  emojiPickerOpen$ = this._emojiPickerOpen.asObservable()
  private _winksPickerOpen = new Subject()
  winksPickerOpen$ = this._winksPickerOpen.asObservable()
  private _textEditOpen = new Subject()
  textEditOpen$ = this._textEditOpen.asObservable()
  @ViewChild('dialogImg') dialogImg !: ElementRef
  @ViewChild('imgDialog') imgDialog !: ElementRef
  @ViewChild('dialogImgSend') dialogImgSend !: ElementRef
  @ViewChild('imgDialogSend') imgDialogSend !: ElementRef
  @ViewChild('photoInput') photoInput !: ElementRef
  @ViewChild('chatList') chatList : ElementRef | undefined
  @ViewChild('messageInput') messageInput !: ElementRef
  private _scrolledChatList = false
  dragPosition = {
    x: 0,
    y: 0
  }
  private _lastPosition = {
    x: 0,
    y: 0
  }
  style = {
    color: '',
    fontSize: '1rem',
    fontWeight: '',
    fontFamily: '',
    textShadow: 'none'
  }
  loggedUser : Utilisateur = localStorage.getItem('utilisateur') ? JSON.parse(localStorage.getItem('utilisateur')!) : undefined
  messages : Message[] = []
  isFavoris = false

  constructor(
    private _windowInfoService : WindowInfoService, 
    private _winksService : WinksService,
    private _erreurService : ErreurService,
    private _messageService : MessageService,
    private _conversationService : ConversationService,
    private _rxStompService : RxStompService,
    private _notificationService : NotificationService
  ) {}

  get isLoading(){
    return this._isLoading
  }

  get conversation(){
    return this._conversation
  }

  get isFullScreen(){
    return this._isFullScreen
  }

  get appelStarted(){
    return this.appelStarted$
  }

  ngOnInit(): void {
    this._windowInfoService.onChatWindowOpen(true)
    this._subscriptions.push(
      this._windowInfoService.chatWidowMinimizeOrResume$.subscribe(()=>this.minimizeOrResume())
    )
    this._subscriptions.push(
      this._rxStompService.watch("/topic/conversation/" + this._conversation.id).subscribe({
        next:(response) => {
          const message : Message = JSON.parse(response.body)
          if(message){
            if(message.type === 'wink'){
              const wink = getWink(message.winkName ?? '')
              if(wink && message.nomSender !== this.loggedUser.nomComplet){
                this._winksService.onWinksToPlay(wink)
              }
            }else if(message.type === 'nudge' && message.nomSender !== this.loggedUser.nomComplet){
              this.nudge()
            }
            this.messages.push(message)
            setTimeout(()=>{
              if(this.chatList){
                this.chatList.nativeElement.scrollTop = this.chatList.nativeElement.scrollHeight
              }
            },10)
          }
          
        }
      })
    )

    this._notificationService.setCurrentConversationNom(
      this.conversation?.utilisateurs.find(u => u.id != this.loggedUser.id)!.nomComplet
    )
  }

  ngAfterViewInit(): void {
    this.positionAnimation()
  }

  ngAfterContentChecked(): void {
    if(this.chatList){
      if(!this._scrolledChatList){
        this.chatList.nativeElement.scrollTop = this.chatList.nativeElement.scrollHeight
        this._scrolledChatList = true
      }
    }
  }

  ngOnDestroy(): void {
    this._windowInfoService.onChatWindowOpen(false)
    this._isMinimized = false
    this._isFullScreen = false
    this._subscriptions.forEach(sub => sub.unsubscribe())
    this._scrolledChatList = false
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

  setConversation(conversation : Conversation){
    this._conversation = conversation
    this.getMesages()
    this._isLoading = false
    this.isFavoris = this._conversationService.isFavoris(this.loggedUser.id, this._conversation.id)
  }

  getMesages(){
    this._subscriptions.push(
      this._messageService.getMessages(this._conversation.id).subscribe(
        {
          next : (response)=>{
            if(response.body == null) return
            this.messages = response.body
            setTimeout(()=>{
              if(this.chatList){
                this.chatList.nativeElement.scrollTop = this.chatList.nativeElement.scrollHeight
              }
            },10)
          },
          error : (error)=>{
            const erreur = new Erreur(error.error.httpStatus ?? error.error.code,error.error.message)
            this._erreurService.onErreursEvent(erreur)
          }
        }
      )
    )
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

  onDragEnd($event : CdkDragEnd){
    this._lastPosition = $event.source.getFreeDragPosition()
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
    const message = new Message(0,'',new Date(),this.loggedUser.nomComplet,'nudge',{id:this._conversation.id})
    this._rxStompService.publish({
      destination: '/app/chat/' + this.conversation.id,
      body: JSON.stringify(message)
    })
    this.sendNotification('nudge')
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

  onShowDialogImg(event : any) : void{
    this.imgDialog.nativeElement.src = event.target.src
    this.dialogImg.nativeElement.style.opacity = '1'
    this.dialogImg.nativeElement.style.visibility = 'visible'
  }

  onPhotoSelection() : void{
    this.dialogImgSend.nativeElement.style.opacity = '1'
    this.dialogImgSend.nativeElement.style.visibility = 'visible'
  }

  onHideDialogImg() : void{
    this.dialogImg.nativeElement.style.opacity = '0'
    this.dialogImg.nativeElement.style.visibility = 'hidden'
  }

  onHideDialogImgSend() : void{
    this.dialogImgSend.nativeElement.style.opacity = '0'
    this.dialogImgSend.nativeElement.style.visibility = 'hidden'
    setTimeout(()=>{
      this.photoInput.nativeElement.value = ''
      this.imgDialogSend.nativeElement.src = 'assets/images/default.png'
    },500)
  }

  onImgSendChange() : void{
    const file = this.photoInput.nativeElement.files[0]
    const result = verifyFile(file)
    if(result === "bon"){
      this.imgDialogSend.nativeElement.src = URL.createObjectURL(file)
    }else{
      const erreur = new Erreur("Upload d'image", result)
      this._erreurService.onErreursEvent(erreur)
      this.photoInput.nativeElement.value = ''
    }
  }

  onEmojiPickerOpen() : void{
    this._emojiPickerOpen.next(null)
  }

  parseEmoji(emoji : string) : string{
    return parseEmoji(emoji)
  }

  parseStyle(style : string | null | undefined) : any{
    if(!style || style === null) return {}
    return JSON.parse(style)
  }

  onEmojiPicked(emojiCode : string) : void{
    this.messageInput.nativeElement.value += emojiCode
    this.messageInput.nativeElement.focus()
  }

  onWinkPickerOpen() : void{
    this._winksPickerOpen.next(null)
  }

  onTextEditOpen() : void{
    this._textEditOpen.next(null)
  }

  onTextEdited(textStyle : any) : void{
    this.style = textStyle
  }

  onPlayWink($event : Event) : void{
    const elem = $event.target as HTMLElement
    const wink = getWink(elem.getAttribute("winkName") ?? '')
    if(wink){
      this._winksService.onWinksToPlay(wink)
    }
  }
  
  onSendMessage($event : KeyboardEvent) : void{
    if($event.key === "Enter"){
      this.sendMessage()
    }
  }

  sendMessage() : void{
    if(this.messageInput.nativeElement.value !== ""){
      const message = new Message(0, this.messageInput.nativeElement.value, new Date(), this.loggedUser.nomComplet, "text", {id:this._conversation.id}, JSON.stringify(this.style))
      this._rxStompService.publish({
        destination: '/app/chat/' + this.conversation.id,
        body: JSON.stringify(message)
      })
      this.messageInput.nativeElement.value = ""
      this.sendNotification("message")
    }
  }

  onCloseChat(){
    this._windowInfoService.onChatWindowClose()
  }

  onFavorisClick(){
    if(this.isFavoris){
      this._conversationService.removeFromFavoris(this.loggedUser.id, this.conversation.id)
    }else{
      this._conversationService.addToFavoris(this.loggedUser.id, this.conversation.id)
    }
    this.isFavoris = !this.isFavoris
  }

  sendNotification(origine : string){
    const receiverId = this.conversation.utilisateurs.find(u => u.id != this.loggedUser.id)!.id
    const notification = new Notification(0, this.loggedUser.nomComplet,`Vous a envoyé un ${origine}`, new Date(), "msn", receiverId, false, this.loggedUser.avatar as string)
    this._notificationService.sendNotification(notification)
  }

  onSendImg(){
    const file = this.photoInput.nativeElement.files[0]
    const result = verifyFile(file)
    if(result === "bon"){
      const message = new Message(0, '', new Date(), this.loggedUser.nomComplet, "image", {id:this._conversation.id}, JSON.stringify(this.style))
      const formData = new FormData()
      formData.append('file', file)
      formData.append('message', 
        new Blob([JSON.stringify(message)], {type: 'application/json'})
      )
      this._subscriptions.push(
        this._messageService.sendImgMessage(formData, this._conversation.id).subscribe(
          {
            next : ()=>{
              this.sendNotification("image")
            },
            error : (err)=>{
              const erreur = new Erreur(err.error.httpStatus ?? err.error.code,err.error.message)
              this._erreurService.onErreursEvent(erreur)
            }
          }
        )
      )
      this.onHideDialogImgSend()
    }
  }
}
