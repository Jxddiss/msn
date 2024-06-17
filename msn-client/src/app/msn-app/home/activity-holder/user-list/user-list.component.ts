import { Component, OnDestroy, OnInit } from '@angular/core';
import { WindowInfoService } from '../../../../service/window-info.service';
import { ConversationService } from '../../../../service/conversation.service';
import { Conversation } from '../../../../model/conversation.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit, OnDestroy {
  loggedUser = JSON.parse(localStorage.getItem('utilisateur')!)
  conversations : Conversation[] = []
  favoris : Conversation[] = []
  private _subscriptions : Subscription[] = []

  constructor(
    private _windowInfoService : WindowInfoService,
    private _conversationService : ConversationService
  ) { }

  ngOnInit(): void {
    this.conversations = this._conversationService.getConversations(this.loggedUser.id)
    this._subscriptions.push(this._conversationService.getFavoris(this.loggedUser.id).subscribe(favoris => this.favoris = favoris))
    this._subscriptions.push(this._conversationService.favoris$.subscribe(favoris => this.favoris = favoris))
  }

  onOpenChat(conversation : Conversation) {
    this._windowInfoService.onInitialiseChatBox(conversation)
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach(sub => sub.unsubscribe())
  }
}
