package com.nicholsonrainville.msn.msn.service.impl;

import com.nicholsonrainville.msn.msn.entity.Conversation;
import com.nicholsonrainville.msn.msn.entity.Message;
import com.nicholsonrainville.msn.msn.repository.ConversationRepository;
import com.nicholsonrainville.msn.msn.repository.MessageRepository;
import com.nicholsonrainville.msn.msn.service.MessageService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class MessageServiceImpl implements MessageService {

    private final MessageRepository messageRepository;
    private final ConversationRepository conversationRepository;

    @Autowired
    public MessageServiceImpl(MessageRepository messageRepository, ConversationRepository conversationRepository) {
        this.messageRepository = messageRepository;
        this.conversationRepository = conversationRepository;
    }

    @Override
    public Message save(Message message) {
        return messageRepository.save(message);
    }
}
