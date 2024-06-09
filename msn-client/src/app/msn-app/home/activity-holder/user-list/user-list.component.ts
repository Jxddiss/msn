import { Component } from '@angular/core';
import { WindowInfoService } from '../../../../service/window-info.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent {

  constructor(private _windowInfoService : WindowInfoService) { }

  onOpenChat(){
    this._windowInfoService.onInitialiseChatBox()
  }
}
