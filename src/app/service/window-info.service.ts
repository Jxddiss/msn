import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WindowInfoService {
  private _canBeFullScreen = new Subject<boolean>();
  canBeFullScreen$ = this._canBeFullScreen.asObservable();

  constructor() { }

  onCanBeFullScreen(value : boolean){
    this._canBeFullScreen.next(value)
  }
}
