package com.nicholsonrainville.msn.msn.controlleur.websocket;

import com.nicholsonrainville.msn.msn.entity.Notification;
import com.nicholsonrainville.msn.msn.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.resource.NoResourceFoundException;

@RestController
public class NotificationController {
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final NotificationService notificationService;

    @Autowired
    public NotificationController(SimpMessagingTemplate simpMessagingTemplate, NotificationService notificationService) {
        this.simpMessagingTemplate = simpMessagingTemplate;
        this.notificationService = notificationService;
    }

    @PostMapping("/notification/set-lu")
    public ResponseEntity<Boolean> setNotificationLu(@Param("id") Long id, HttpMethod httpMethod) throws NoResourceFoundException {
        Notification notification = notificationService.markAsRead(id);
        if(notification == null){
            throw new NoResourceFoundException(httpMethod,"La notification n'existe pas id : "+id);
        }
        return new ResponseEntity<>(true, HttpStatus.OK);
    }

    @MessageMapping("/notification/{userId}")
    @SendTo("/topic/notification/{userId}")
    public Notification notificationVise(Notification notif, @DestinationVariable("userId") Long userId){
        notif.setLu(false);
        notif.setReceveurId(userId);
        return notificationService.save(notif);
    }
}
