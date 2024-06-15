import { Injectable } from '@angular/core';
import { CONVERSATIONS } from '../mocks/conversation.mock';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {

  constructor() { }

  public getConversations(utilisateurId: number) {
    return CONVERSATIONS.filter(conversation => conversation.utilisateurs.find(utilisateur => utilisateur.id === utilisateurId));
  }
}
