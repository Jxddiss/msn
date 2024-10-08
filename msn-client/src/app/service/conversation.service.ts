import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, of } from 'rxjs';
import { Conversation } from '../model/conversation.model';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../constants/environment.constant';
import { Erreur } from '../model/erreur.model';
import { ErreurService } from './erreur.service';

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
  private _subscriptions : Subscription[] = [];
  private _firstConversationSubject = new BehaviorSubject<Conversation | null>(null);
  public firstConversation$ = this._firstConversationSubject.asObservable();

  constructor(private _httpClient: HttpClient, private _erreurService: ErreurService) { }

  getConversations(utilisateurId: number) {
    this._subscriptions.push(
      this._httpClient.get<Conversation[]>(this.backendUrl + 'conversations/' + utilisateurId, {observe: 'response'}).subscribe({
        next: (response) => {
          this._conversationsSubject.next(response.body!);
          this._conversations = response.body!
          this.getFavoris(utilisateurId)
          this.getFirstConversation()
        },
        error: (error) => {
          const erreur = new Erreur(error.error.httpStatus ?? error.error.code,error.error.message)
          this._erreurService.onErreursEvent(erreur)
        }
      })
    )
  }
  
  getFirstConversation() {
    const conversation = this._conversations[0]
    if(conversation) {
      this._firstConversationSubject.next(conversation)

    }else{
      this._firstConversationSubject.next(null)
    }
  }

  getFavoris(utilisateurId: number) {
    const favoris = localStorage.getItem('favoris_' + utilisateurId.toString()) ? JSON.parse(localStorage.getItem('favoris_' + utilisateurId.toString())!) : []
    const filteredConversations = this._conversations.filter(conversation => favoris.includes(conversation.id));
    this._favorisSubject.next(filteredConversations)
  }

  addToFavoris(utilisateurId: number, conversationId: number) {
    const favoris = localStorage.getItem('favoris_' + utilisateurId.toString()) ? JSON.parse(localStorage.getItem('favoris_' + utilisateurId.toString())!) : []
    favoris.push(conversationId)
    localStorage.setItem('favoris_' + utilisateurId.toString(), JSON.stringify(favoris))
    this.updateFavoris(utilisateurId)
  }

  removeFromFavoris(utilisateurId: number, conversationId: number) {
    const favoris = localStorage.getItem('favoris_' + utilisateurId.toString()) ? JSON.parse(localStorage.getItem('favoris_' + utilisateurId.toString())!) : []
    favoris.splice(favoris.indexOf(conversationId), 1)
    localStorage.setItem('favoris_' + utilisateurId.toString(), JSON.stringify(favoris))
    this.updateFavoris(utilisateurId)
  }

  isFavoris(utilisateurId: number, conversationId: number) : boolean {
    const favoris = localStorage.getItem('favoris_' + utilisateurId.toString()) ? JSON.parse(localStorage.getItem('favoris_' + utilisateurId.toString())!) : []
    return favoris.includes(conversationId)
  }

  cleanUp() {
    this._subscriptions.forEach(sub => sub.unsubscribe())
    this._subscriptions = []
    this._conversationsSubject.next([])
    this._favorisSubject.next([])
    this._firstConversationSubject.next(null)
    this._conversations = []
  }

  private updateFavoris(utilisateurId: number): void {
    const favoris = localStorage.getItem('favoris_' + utilisateurId.toString()) ? JSON.parse(localStorage.getItem('favoris_' + utilisateurId.toString())!) : [];
    const filteredConversations = this._conversations.filter(conversation => favoris.includes(conversation.id));
    this._favorisSubject.next(filteredConversations);
  }
}
