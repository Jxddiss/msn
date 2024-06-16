import { Component, OnInit } from '@angular/core';
import { WindowInfoService } from '../../../../service/window-info.service';
import { ConversationService } from '../../../../service/conversation.service';
import { Conversation } from '../../../../model/conversation.model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {
  loggedUser = JSON.parse(localStorage.getItem('utilisateur')!)
  conversations : Conversation[] = []

  constructor(
    private _windowInfoService : WindowInfoService,
    private _conversationService : ConversationService
  ) { }

  ngOnInit(): void {
    this.conversations = this._conversationService.getConversations(this.loggedUser.id)
  }

  onOpenChat(conversation : Conversation) {
    this._windowInfoService.onInitialiseChatBox(conversation)
  }
}
