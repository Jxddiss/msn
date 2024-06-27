import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Conversation } from '../model/conversation.model';

@Injectable({
  providedIn: 'root'
})
export class WindowInfoService {
  private _canBeFullScreen = new Subject<boolean>();
  canBeFullScreen$ = this._canBeFullScreen.asObservable();
  private _chatWindowOpen = new Subject<boolean>();
  chatWindowOpen$ = this._chatWindowOpen.asObservable();
  private _homeWindowOpen = new Subject<boolean>();
  homeWindowOpen$ = this._homeWindowOpen.asObservable();
  private _chatWidowMinimizeOrResume = new Subject();
  chatWidowMinimizeOrResume$ = this._chatWidowMinimizeOrResume.asObservable();
  private _msnCloseEvent = new Subject();
  msnCloseEvent$ = this._msnCloseEvent.asObservable();
  private _initaliseChatBox = new Subject<Conversation>();
  initaliseChatBox$ = this._initaliseChatBox.asObservable();
  private _chatWindowClose = new Subject();
  chatWindowClose$ = this._chatWindowClose.asObservable();
  private _openDialogAjout = new Subject();
  openDialogAjout$ = this._openDialogAjout.asObservable();
  private _openDialogInviter = new Subject();
  openDialogInviter$ = this._openDialogInviter.asObservable();
  private _openDialogDemandes = new Subject();
  openDialogDemandes$ = this._openDialogDemandes.asObservable();
  private _disparition = new Subject();
  disparition$ = this._disparition.asObservable();

  constructor() { }

  onCanBeFullScreen(value : boolean){
    this._canBeFullScreen.next(value)
  }

  onChatWindowOpen(value : boolean){
    this._chatWindowOpen.next(value)
  }

  onHomeWindowOpen(value : boolean){
    this._homeWindowOpen.next(value)
  }

  onChatWidowMinimizeOrResume(){
    this._chatWidowMinimizeOrResume.next(null)
  }

  onMsnCloseEvent(){
    this._msnCloseEvent.next(null)
  }

  onInitialiseChatBox(conversation : Conversation){
    this._initaliseChatBox.next(conversation)
  }

  onChatWindowClose(){
    this._chatWindowOpen.next(false)
    this._chatWindowClose.next(null)
  }

  onOpenDialogAjout(){
    this._openDialogAjout.next(null)
  }

  onOpenDialogInviter(){
    this._openDialogInviter.next(null)
  }

  onOpenDialogDemandes(){
    this._openDialogDemandes.next(null)
  }

  onDisparition(){
    this._disparition.next(null)
  }
}
