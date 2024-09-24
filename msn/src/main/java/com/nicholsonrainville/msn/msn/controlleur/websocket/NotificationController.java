package com.nicholsonrainville.msn.msn.controlleur.websocket;

import com.nicholsonrainville.msn.msn.entity.Notification;
import com.nicholsonrainville.msn.msn.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class NotificationController {
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final NotificationService notificationService;

    @Autowired
    public NotificationController(SimpMessagingTemplate simpMessagingTemplate, NotificationService notificationService) {
        this.simpMessagingTemplate = simpMessagingTemplate;
        this.notificationService = notificationService;
    }

    @MessageMapping("/notification/set-lu/{id}")
    public void setNotificationLu(@DestinationVariable("id") Long id) {
        notificationService.markAsRead(id);
    }

    @MessageMapping("/notification/{userId}")
    @SendTo("/topic/notification/{userId}")
    public Notification notificationVise(Notification notif, @DestinationVariable("userId") Long userId){
        notif.setLu(false);
        notif.setReceveurId(userId);
        return notificationService.save(notif);
    }

    @GetMapping("/notification/{userId}")
    public ResponseEntity<List<Notification>> getNotificationByReceveurId(@PathVariable("userId") Long userId) {
        return new ResponseEntity<>(notificationService.getNotificationByReceveurId(userId), HttpStatus.OK);
    }
}
