import { Injectable } from '@angular/core';
import { BehaviorSubject,  Subscription } from 'rxjs';
import { RxStompService } from './rx-stomp.service';
import { Notification } from '../model/notification.model';
import { AuthentificationService } from './authentification.service';
import { DemandeService } from './demande.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private _notificationSubject = new BehaviorSubject<Notification>({} as Notification)
  notification$ = this._notificationSubject.asObservable()
  private _currentConversationNom = ''

  private _subscriptions : Subscription[] = []

  constructor(private _rxStompService : RxStompService, 
    private _authentificationService : AuthentificationService,
    private _demandeService : DemandeService
  ) {
    
    this._subscriptions.push(
      this._rxStompService.watch('/topic/notification/'+this._authentificationService.loggedUser?.id).subscribe(
        (response)=>{
          const notification : Notification = JSON.parse(response.body) as Notification
          if(notification){
            if(this._currentConversationNom !== notification.titre){
              console.log("notification titre" + notification.titre)
              console.log("current conversation nom" + this._currentConversationNom)
              this._notificationSubject.next(notification)
            }
            this._demandeService.getDemandes(this._authentificationService.loggedUser?.id!)
          }
        }
      )
    )
  }

  sendNotification(notification : Notification){
    this._rxStompService.publish({
      destination: '/app/notification/'+notification.receveurId,
      body: JSON.stringify(notification)
    })
  }

  sendInternalNotification(notification : Notification){
    if(notification.titre !== this._currentConversationNom){
      this._notificationSubject.next(notification)
    }
  }

  setCurrentConversationNom(nom : string){
    this._currentConversationNom = nom
  }
}
