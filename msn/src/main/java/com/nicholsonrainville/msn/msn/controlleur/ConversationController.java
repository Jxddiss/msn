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

import java.util.List;
import java.util.Set;

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
        Set<Message> messages = conversation.getMessages();
        return new ResponseEntity<>(messages, HttpStatus.OK);
    }

}
