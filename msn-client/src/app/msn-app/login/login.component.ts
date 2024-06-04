import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { WindowInfoService } from '../../service/window-info.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  @Output() canBeFullScreenEvent = new EventEmitter<boolean>()
  canBeFullScreen = false

  constructor(private _windowInfoService : WindowInfoService) { }

  ngOnInit(): void {
    this.onFullScreen()
  }

  onFullScreen(){
    this._windowInfoService.onCanBeFullScreen(this.canBeFullScreen)
  }
}
