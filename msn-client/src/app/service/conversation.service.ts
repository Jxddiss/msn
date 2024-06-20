import { Injectable } from '@angular/core';
import { CONVERSATIONS } from '../mocks/conversation.mock';
import { BehaviorSubject, of } from 'rxjs';
import { Conversation } from '../model/conversation.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../constants/environment.constant';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {
  private backendUrl = environment.apiUrl;
  private _conversationsSubject = new BehaviorSubject<Conversation[]>([]);
  public conversations$ = this._conversationsSubject.asObservable();
  private _favorisSubject = new BehaviorSubject<Conversation[]>([]);
  public favoris$ = this._favorisSubject.asObservable();
  private _conversations : Conversation[] = [];

  constructor(private _httpClient: HttpClient) { }

  public getConversations(utilisateurId: number) {
    this._httpClient.get<Conversation[]>(this.backendUrl + 'conversations/' + utilisateurId).subscribe(conversations => {
      this._conversationsSubject.next(conversations);
      this._conversations = conversations
    })
  }
  
  public getFirstConversation(utilisateurId: number) {
    return this._conversations.find(conversation => conversation.utilisateurs.find(utilisateur => utilisateur.id === utilisateurId));
  }

  public getFavoris(utilisateurId: number) {
    const favoris = localStorage.getItem('favoris_' + utilisateurId.toString()) ? JSON.parse(localStorage.getItem('favoris_' + utilisateurId.toString())!) : []
    const filteredConversations = this._conversations.filter(conversation => favoris.includes(conversation.id));
    this._favorisSubject.next(filteredConversations)
  }

  public addToFavoris(utilisateurId: number, conversationId: number) {
    const favoris = localStorage.getItem('favoris_' + utilisateurId.toString()) ? JSON.parse(localStorage.getItem('favoris_' + utilisateurId.toString())!) : []
    favoris.push(conversationId)
    localStorage.setItem('favoris_' + utilisateurId.toString(), JSON.stringify(favoris))
    this.updateFavoris(utilisateurId)
  }

  public removeFromFavoris(utilisateurId: number, conversationId: number) {
    const favoris = localStorage.getItem('favoris_' + utilisateurId.toString()) ? JSON.parse(localStorage.getItem('favoris_' + utilisateurId.toString())!) : []
    favoris.splice(favoris.indexOf(conversationId), 1)
    localStorage.setItem('favoris_' + utilisateurId.toString(), JSON.stringify(favoris))
    this.updateFavoris(utilisateurId)
  }

  private updateFavoris(utilisateurId: number): void {
    const favoris = localStorage.getItem('favoris_' + utilisateurId.toString()) ? JSON.parse(localStorage.getItem('favoris_' + utilisateurId.toString())!) : [];
    const filteredConversations = this._conversations.filter(conversation => favoris.includes(conversation.id));
    this._favorisSubject.next(filteredConversations);
  }

  public isFavoris(utilisateurId: number, conversationId: number) : boolean {
    const favoris = localStorage.getItem('favoris_' + utilisateurId.toString()) ? JSON.parse(localStorage.getItem('favoris_' + utilisateurId.toString())!) : []
    return favoris.includes(conversationId)
  }
}
