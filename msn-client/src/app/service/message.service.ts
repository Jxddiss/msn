import { Injectable } from '@angular/core';
import { getMessages, sendMessage } from '../mocks/message.mock';
import { Observable, of } from 'rxjs';
import { Message } from '../model/message.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor() { }

  getMessages(idConversation : number) : Observable<Message[]> {
    return of(getMessages(idConversation));
  }

  sendMessage(message : Message) : Observable<Message> {
    sendMessage(message);
    return of(message);
  }
}
