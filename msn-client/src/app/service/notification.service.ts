import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { RxStompService } from './rx-stomp.service';
import { Notification } from '../model/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private _notificationSubject = new Subject<Notification>()
  notification$ = this._notificationSubject.asObservable()

  constructor(private _rxStompService : RxStompService) { }

  sendNotification(notification : Notification){
    this._rxStompService.publish({
      destination: '/app/notification/'+notification.receveurId,
      body: JSON.stringify(notification)
    })
  }

  onNotificationReceived(notification : Notification){
    this._notificationSubject.next(notification)
  }
}
