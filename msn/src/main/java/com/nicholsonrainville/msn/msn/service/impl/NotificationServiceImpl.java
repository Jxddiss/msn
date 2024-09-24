package com.nicholsonrainville.msn.msn.service.impl;

import com.nicholsonrainville.msn.msn.entity.Notification;
import com.nicholsonrainville.msn.msn.repository.NotificationRepository;
import com.nicholsonrainville.msn.msn.service.NotificationService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@Transactional
public class NotificationServiceImpl implements NotificationService {
    private final NotificationRepository notificationRepository;

    @Autowired
    public NotificationServiceImpl(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Override
    public Notification sendNotification(Long receveurId, String titre, String message, String lien, String image, String type) {
        Notification notification = new Notification();
        notification.setReceveurId(receveurId);
        notification.setTitre(titre);
        notification.setMessage(message);
        notification.setLien(lien);
        notification.setImage(image);
        notification.setType(type);
        notification.setLu(false);
        return notificationRepository.save(notification);
    }

    @Override
    public Notification markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id).orElse(null);
        if (notification != null) {
            notification.setLu(true);
            return notificationRepository.save(notification);
        }
        return null;
    }

    @Override
    public List<Notification> getNotificationByReceveurId(Long receveurId) {
        return notificationRepository.getNotificationByReceveurId(receveurId);
    }

    @Override
    public void deleteNotification(Long id) {
        notificationRepository.deleteById(id);
    }

    @Override
    public Notification save(Notification notification) {
        return notificationRepository.save(notification);
    }
}
