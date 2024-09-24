package com.nicholsonrainville.msn.msn.listener;

import com.nicholsonrainville.msn.msn.entity.Utilisateur;
import com.nicholsonrainville.msn.msn.service.UtilisateurService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
public class DisconnectListenner {
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final UtilisateurService utilisateurService;

    @Autowired
    public DisconnectListenner(SimpMessagingTemplate simpMessagingTemplate, UtilisateurService utilisateurService) {
        this.simpMessagingTemplate = simpMessagingTemplate;
        this.utilisateurService = utilisateurService;
    }

    @EventListener
    public void handleWebSocketDisconnect( SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());

        String email = headerAccessor.getUser().getName();

        if (email != null) {
            Utilisateur utilisateur = utilisateurService.findByEmail(email);
            if(!utilisateur.getStatut().equals("disconnected")) {
                utilisateurService.changeStatut("absent", utilisateur.getId());
                simpMessagingTemplate.convertAndSend("/topic/user/status/" + utilisateur.getId(), "absent");
            }
        }
    }
}
