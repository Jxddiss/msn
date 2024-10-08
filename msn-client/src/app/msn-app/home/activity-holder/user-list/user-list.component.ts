import { Component, OnDestroy, OnInit } from '@angular/core';
import { WindowInfoService } from '../../../../service/window-info.service';
import { ConversationService } from '../../../../service/conversation.service';
import { Conversation } from '../../../../model/conversation.model';
import { Subscription } from 'rxjs';
import { RxStompService } from '../../../../service/rx-stomp.service';
import { NotificationService } from '../../../../service/notification.service';
import { Notification } from '../../../../model/notification.model';

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
    private _conversationService : ConversationService,
    private _rxStompService : RxStompService,
    private _notificationService : NotificationService
  ) { }

  ngOnInit(): void {
    this._subscriptions.push(this._conversationService.favoris$.subscribe(favoris => this.favoris = favoris))
    this._subscriptions.push(this._conversationService.conversations$.subscribe({
      next: (conversations) => {
        this.conversations = conversations
        this.setUpConversationStatusChange()
      }
    }))
    this._conversationService.getConversations(this.loggedUser.id)
  }

  onOpenChat(conversation : Conversation) {
    this._windowInfoService.onInitialiseChatBox(conversation)
  }

  setUpConversationStatusChange(){
    this.conversations.forEach(conversation => {
      const otherUserId = conversation.utilisateurs.find(u => u.id != this.loggedUser.id)!.id
      this._subscriptions.push(
        this._rxStompService
          .watch(`/topic/user/status/${otherUserId}`)
          .subscribe((response) => {
            const status = response.body
            const otherUser = conversation.utilisateurs.find(u => u.id != this.loggedUser.id)!
            otherUser.statut = status
            if(status == "online"){
              const notification = new Notification(0,otherUser.nomComplet,"Est en ligne",new Date(),"msn",0,false,otherUser.avatar as string)
              this._notificationService.sendInternalNotification(notification)
            }
          })
      )
    })
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach(sub => sub.unsubscribe())
    this._conversationService.cleanUp()
  }
}
