import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { WindowInfoService } from '../../../service/window-info.service';

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrl: './chatbox.component.css'
})
export class ChatboxComponent implements AfterViewInit, OnDestroy{

  constructor(private _windowInfoService : WindowInfoService) { }

  ngAfterViewInit(): void {
    this._windowInfoService.onChatWindowOpen(true)
  }

  ngOnDestroy(): void {
    this._windowInfoService.onChatWindowOpen(false)
  }

}
