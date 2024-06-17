import { AfterViewInit, Component, ComponentRef, EventEmitter, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import gsap from 'gsap';
import { WindowInfoService } from '../service/window-info.service';
import { ChatboxComponent } from './home/chatbox/chatbox.component';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Conversation } from '../model/conversation.model';
import { ConversationService } from '../service/conversation.service';
import { Utilisateur } from '../model/utilisateur.model';

@Component({
  selector: 'app-msn-app',
  templateUrl: './msn-app.component.html',
  styleUrl: './msn-app.component.css'
})
export class MsnApp implements AfterViewInit, OnDestroy, OnInit{
  @ViewChild('secondWindowContainer', { read: ViewContainerRef })
  secondWindowContainer: ViewContainerRef | undefined;
  componentRef : ComponentRef<ChatboxComponent> | undefined
  close = new EventEmitter();
  canBeFullScreen = false
  isMinimized = false
  private _subscriptions : Subscription[] = []
  dragPosition = {
    x: 0,
    y: 0
  }

  constructor(
    private _windowInfoService : WindowInfoService, 
    private _router : Router,
    private _conversationService : ConversationService
  ) {
    this._subscriptions.push(
      this._windowInfoService.canBeFullScreen$.subscribe(value => {
        this.canBeFullScreen = value
      })
    )

    this._subscriptions.push(
      this._windowInfoService.msnCloseEvent$.subscribe(value => {
        this.onQuitWindow()
      })
    )

    this._subscriptions.push(
      this._windowInfoService.initaliseChatBox$.subscribe(conversation => {
        this.initialiseChatBox(conversation)
      })
    )
  }

  ngOnInit(){
    this._subscriptions.push(
      this._windowInfoService.homeWindowOpen$.subscribe(value => {
        if(value){
          const loggedUser = localStorage.getItem('utilisateur') ? JSON.parse(localStorage.getItem('utilisateur')!) : undefined
          const conversation = this._conversationService.getFirstConversation(loggedUser.id)
          if(conversation) this.initialiseChatBox(conversation)
        }
      })
    )
    this._subscriptions.push(
      this._windowInfoService.chatWindowClose$.subscribe(value => {
        this.componentRef?.instance.disparition()
        setTimeout(()=>{this.secondWindowContainer?.clear()},500)
      })
    )
  }

  ngAfterViewInit(){
    this.apparition()
    this._subscriptions.push(
      this._router.events.subscribe(() => {
        this.secondWindowContainer?.clear();
        this.resetPosition()
      })
    )
  }
  
  onQuitWindow(){
    this.close.emit(null)
  }

  minimizeOrResume(){
    if(this.isMinimized){
      this.isMinimized = false
      this.apparition('.msn-window')
    }else{
      this.disparition('.msn-window')
      this.isMinimized = true
    }
  }

  ngOnDestroy(){
    this._subscriptions.forEach(sub => sub.unsubscribe())
  }

  apparition(sel : string = '.window-msn') : void{
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

  disparition(sel : string = '.window-msn') : void{
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

  initialiseChatBox(conversation : Conversation) : void{
    let delay = 0
    if(this.componentRef){
      this.componentRef.instance.disparition()
      delay = 500
    }
    setTimeout(()=>{
      this.secondWindowContainer?.clear();
      this.componentRef = this.secondWindowContainer?.createComponent(ChatboxComponent);
      this.componentRef?.instance.setConversation(conversation)
    },delay)
  }

  resetPosition() {
    this.dragPosition = {
      x: 0,
      y: 0
    }

    gsap.set('.msn-window', {left: '50%',})
    if(this.isMinimized){
      this.apparition('.msn-window')
      this.isMinimized = false
    }
  }
}
