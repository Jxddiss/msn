import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Wink } from '../model/wink.model';

@Injectable({
  providedIn: 'root'
})
export class WinksService {
  private _winksToPlay = new Subject<Wink>();
  winksToPlay$ = this._winksToPlay.asObservable();

  constructor() { }

  onWinksToPlay(wink: Wink){
    this._winksToPlay.next(wink)
  }
}
