import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from '../model/message.model';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../constants/environment.constant';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private _backend = environment.apiUrl;

  constructor(private _httpClient : HttpClient) { }

  getMessages(idConversation : number) : Observable<HttpResponse<Message[]>> {
    return this._httpClient.get<Message[]>(this._backend + 'conversations/messages/' + idConversation, {observe : 'response'});
  }

  sendImgMessage(formData : FormData, idConversation : number)  {
    return this._httpClient.post(this._backend + 'messages/image/'+idConversation, formData);
  }
}
