package com.nicholsonrainville.msn.msn.service;

import com.nicholsonrainville.msn.msn.entity.Notification;

import java.util.List;

public interface NotificationService {

    Notification sendNotification(Long receveurId, String titre, String message, String lien, String image, String type);

    Notification markAsRead(Long id);

    List<Notification> getNotificationByReceveurId(Long receveurId);

    void deleteNotification(Long id);
}
