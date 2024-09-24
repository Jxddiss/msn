import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { RxStompService } from './rx-stomp.service';
import { Notification } from '../model/notification.model';
import { AuthentificationService } from './authentification.service';
import { DemandeService } from './demande.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../constants/environment.constant';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private _notificationSubject = new BehaviorSubject<Notification>(
    {} as Notification
  );
  notification$ = this._notificationSubject.asObservable();
  private _currentConversationNom = '';
  private _subscriptions: Subscription[] = [];
  private apiUrl = environment.apiUrl;

  constructor(
    private _rxStompService: RxStompService,
    private _authentificationService: AuthentificationService,
    private _demandeService: DemandeService,
    private _httpClient: HttpClient
  ) {
    this._subscriptions.push(
      this._rxStompService
        .watch(
          '/topic/notification/' + this._authentificationService.loggedUser?.id
        )
        .subscribe((response) => {
          const notification: Notification = JSON.parse(
            response.body
          ) as Notification;
          if (notification) {
            if (this._currentConversationNom !== notification.titre) {
              console.log('notification titre' + notification.titre);
              console.log(
                'current conversation nom' + this._currentConversationNom
              );
              this._notificationSubject.next(notification);
            }
            this._demandeService.getDemandes(
              this._authentificationService.loggedUser?.id!
            );
            this.setNotificationAsRead(notification);
          }
        })
    );
  }

  sendNotification(notification: Notification) {
    this._rxStompService.publish({
      destination: '/app/notification/' + notification.receveurId,
      body: JSON.stringify(notification),
    });
  }

  sendInternalNotification(notification: Notification) {
    if (notification.titre !== this._currentConversationNom) {
      this._notificationSubject.next(notification);
    }
  }

  setCurrentConversationNom(nom: string) {
    this._currentConversationNom = nom;
  }

  getAllUnreadNotifications() {
    return this._httpClient
      .get<Notification[]>(
        this.apiUrl +
          'notification/' +
          this._authentificationService.loggedUser?.id,
        { observe: 'response' }
      )
      .subscribe((response) => {
        if (response.body) {
          const notifications = response.body;
          notifications.forEach((notification, index) => {
            setTimeout(() => {
              this._notificationSubject.next(notification);
              this.setNotificationAsRead(notification);
            }, index * 1000);
          });
        }
      });
  }

  private setNotificationAsRead(notification: Notification) {
    this._rxStompService.publish({
      destination: '/app/notification/set-lu/' + notification.id,
      body: '',
    });
  }
}
