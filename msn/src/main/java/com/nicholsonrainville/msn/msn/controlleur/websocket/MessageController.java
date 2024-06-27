package com.nicholsonrainville.msn.msn.controlleur.websocket;

import com.nicholsonrainville.msn.msn.entity.Message;
import com.nicholsonrainville.msn.msn.service.MessageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
public class MessageController {
    private final MessageService messageService;
    private final Logger LOGGER = LoggerFactory.getLogger(getClass());

    @Autowired
    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @MessageMapping("/chat/{conversationId}")
    @SendTo("/topic/conversation/{conversationId}")
    public Message sendMessage(Message message, @AuthenticationPrincipal String userPrincipal) {
        message.setDate(LocalDateTime.now());
        return messageService.save(message);
    }

    @MessageMapping("/chat/appel/call/{conversationId}/{userId}")
    @SendTo("/topic/appel/call/{conversationId}/{userId}")
    public String call(String call) {
        LOGGER.info("Call : " + call);
        return call;
    }

    @MessageMapping("/chat/appel/offer/{conversationId}/{userId}")
    @SendTo("/topic/appel/offer/{conversationId}/{userId}")
    public String offer(String offer) {
        return offer;
    }

    @MessageMapping("/chat/appel/answer/{conversationId}/{userId}")
    @SendTo("/topic/appel/answer/{conversationId}/{userId}")
    public String answer(String answer) {
        return answer;
    }

    @MessageMapping("/chat/appel/candidate/{conversationId}/{userId}")
    @SendTo("/topic/appel/candidate/{conversationId}/{userId}")
    public String candidate(String candidate) {
        return candidate;
    }

    @MessageMapping("/chat/appel/remove/{conversationId}")
    @SendTo("/topic/appel/remove/{conversationId}")
    public String remove(String idUserEtIdAmi) {
        LOGGER.info("idUserEtIdAmi Deconnexion : " + idUserEtIdAmi);
        return "{message : 'disconnected'}";
    }
}
