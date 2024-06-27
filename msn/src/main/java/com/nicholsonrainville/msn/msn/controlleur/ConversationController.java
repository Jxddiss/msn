package com.nicholsonrainville.msn.msn.controlleur;

import com.nicholsonrainville.msn.msn.entity.Conversation;
import com.nicholsonrainville.msn.msn.entity.Message;
import com.nicholsonrainville.msn.msn.service.ConversationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.util.Collections;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
public class ConversationController {
    private final ConversationService conversationService;

    @Autowired
    public ConversationController(ConversationService conversationService) {
        this.conversationService = conversationService;
    }

    //Ajouter authentication get principal pour verifier l'utilisateur
    @GetMapping("/conversations/{idUtilisateur}")
    public ResponseEntity<List<Conversation>> getConversationsByUtilisateurs(@PathVariable Long idUtilisateur) {
        List<Conversation> conversations = conversationService.getConversationsByUtilisateurs(idUtilisateur);
        return new ResponseEntity<>(conversations, HttpStatus.OK);
    }

    @GetMapping("/conversations/messages/{idConversation}")
    public ResponseEntity<Set<Message>> getMessagesByConversationId(@PathVariable Long idConversation,
                                                                     HttpMethod httpMethod) throws NoResourceFoundException {
        Conversation conversation = conversationService.getConversationById(idConversation);
        if (conversation == null) {
            throw new NoResourceFoundException(httpMethod,"La conversation n'existe pas id : "+idConversation);
        }
        List<Message> messages = conversation.getMessages().stream()
                .sorted((message1, message2) -> message2.getId().compareTo(message1.getId()))
                .collect(Collectors.toList());

        Collections.reverse(messages);
        Set<Message> messagesSet = new LinkedHashSet<>(messages);

        return new ResponseEntity<>(messagesSet, HttpStatus.OK);
    }

}
