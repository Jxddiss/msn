import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../constants/environment.constant';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Demande } from '../model/demande.model';
import { ErreurService } from './erreur.service';
import { Erreur } from '../model/erreur.model';
import { ConversationService } from './conversation.service';
import { AuthentificationService } from './authentification.service';

@Injectable({
  providedIn: 'root'
})
export class DemandeService {
  private backendUrl = environment.apiUrl;
  private _demandesSubject = new BehaviorSubject<any[]>([]);
  public demandes$ = this._demandesSubject.asObservable();
  private _demandes : Demande[] = [];
  private _subscriptions : Subscription[] = [];

  constructor(
    private _httpClient: HttpClient,
    private _erreurService: ErreurService,
    private _conversationService: ConversationService,
    private _authentificationService: AuthentificationService
  ) { }

  public getDemandes(utilisateurId: number) {
    this._subscriptions.push(
      this._httpClient.get<Demande[]>(this.backendUrl + 'demandes/' + utilisateurId, {observe: 'response'}).subscribe({
        next: (response) => {
          this._demandesSubject.next(response.body!);
          this._demandes = response.body!
        },
        error: (error) => {
          const erreur = new Erreur(error.error.httpStatus ?? error.error.code,error.error.message)
          this._erreurService.onErreursEvent(erreur)
        }
      })
    )
  }

  public sendDemande(formData: FormData) {
    this._subscriptions.push(
      this._httpClient.post<Demande>(this.backendUrl + 'demandes/send', formData, {observe: 'response'}).subscribe({
        next: (response) => {
          this._demandes.push(response.body!)
          this._demandesSubject.next(this._demandes)
        },
        error: (error) => {
          const erreur = new Erreur(error.error.httpStatus ?? error.error.code,error.error.message)
          this._erreurService.onErreursEvent(erreur)
        }
      })
    )
  }

  public acceptDemande(demandeId: number) {
    this._subscriptions.push(
      this._httpClient.put<boolean>(this.backendUrl + 'demandes/accepter/' + demandeId, {observe: 'response'}).subscribe({
        next: (response) => {
          if(response!) {
            this._conversationService.getConversations(this._authentificationService.loggedUser?.id!)
            this.getDemandes(this._authentificationService.loggedUser?.id!)
          }
        },
        error: (error) => {
          const erreur = new Erreur(error.error.httpStatus ?? error.error.code,error.error.message)
          this._erreurService.onErreursEvent(erreur)
        }
      })
    )
  }

  public refuseDemande(demandeId: number) {
    this._subscriptions.push(
      this._httpClient.put<boolean>(this.backendUrl + 'demandes/refuser/' + demandeId, {observe: 'response'}).subscribe({
        next: (response) => {
          if(response!) {
            this.getDemandes(this._authentificationService.loggedUser?.id!)
          }
        },
        error: (error) => {
          const erreur = new Erreur(error.error.httpStatus ?? error.error.code,error.error.message)
          this._erreurService.onErreursEvent(erreur)
        }
      })
    )
  }

  public inviterAmis(email : string) : Observable<HttpResponse<any>>{
    const formData = new FormData()
    formData.append('email', email)
    return this._httpClient.post(this.backendUrl + 'invite', formData, {observe : 'response'})
  }

  cleanUp() {
    this._subscriptions.forEach(sub => sub.unsubscribe())
  }
}
