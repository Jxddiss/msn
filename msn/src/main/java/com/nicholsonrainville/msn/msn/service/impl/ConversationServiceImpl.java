package com.nicholsonrainville.msn.msn.service.impl;

import com.nicholsonrainville.msn.msn.entity.Conversation;
import com.nicholsonrainville.msn.msn.repository.ConversationRepository;
import com.nicholsonrainville.msn.msn.service.ConversationService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class ConversationServiceImpl implements ConversationService {
    private final ConversationRepository conversationRepository;

    @Autowired
    public ConversationServiceImpl(ConversationRepository conversationRepository) {
        this.conversationRepository = conversationRepository;
    }

    @Override
    public List<Conversation> getConversationsByUtilisateurs(Long idUtilisateur) {
        return conversationRepository.getConversationByUtilisateurs(idUtilisateur);
    }

    @Override
    public Conversation getConversationById(Long idConversation) {
        return conversationRepository.findById(idConversation).orElse(null);
    }

    @Override
    public boolean existsById(Long id) {
        return conversationRepository.existsById(id);
    }

    @Override
    public Conversation save(Conversation conversation) {
        return conversationRepository.save(conversation);
    }

    @Override
    public void delete(Conversation conversation) {
        conversationRepository.delete(conversation);
    }
}
