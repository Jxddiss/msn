package com.nicholsonrainville.msn.msn.controlleur.websocket;

import com.nicholsonrainville.msn.msn.service.UtilisateurService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserWebsocketController {
    private final UtilisateurService utilisateurService;

    @Autowired
    public UserWebsocketController(UtilisateurService utilisateurService) {
        this.utilisateurService = utilisateurService;
    }

    @MessageMapping("/user/status/{userId}")
    @SendTo("/topic/user/status/{userId}")
    public String userStatus(@AuthenticationPrincipal String userPrincipal, String status, @DestinationVariable String userId) {
        if (utilisateurService.validateUser(userPrincipal, Long.parseLong(userId))) {
            utilisateurService.changeStatut(status, Long.parseLong(userId));
            return status;
        }
        return "";
    }
}
