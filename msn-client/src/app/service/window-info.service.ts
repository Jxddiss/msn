import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WindowInfoService {
  private _canBeFullScreen = new Subject<boolean>();
  canBeFullScreen$ = this._canBeFullScreen.asObservable();
  private _chatWindowOpen = new Subject<boolean>();
  chatWindowOpen$ = this._chatWindowOpen.asObservable();

  constructor() { }

  onCanBeFullScreen(value : boolean){
    this._canBeFullScreen.next(value)
  }

  onChatWindowOpen(value : boolean){
    this._chatWindowOpen.next(value)
  }
}
