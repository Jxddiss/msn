package com.nicholsonrainville.msn.msn.service;

import com.nicholsonrainville.msn.msn.entity.Conversation;

import java.util.List;

public interface ConversationService {

    List<Conversation> getConversationsByUtilisateurs(Long idUtilisateur);
    Conversation getConversationById(Long idConversation);
    Conversation save(Conversation conversation);
    void delete(Conversation conversation);

    boolean existsById(Long id);

}
