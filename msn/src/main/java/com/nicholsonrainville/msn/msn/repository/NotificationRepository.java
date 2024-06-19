package com.nicholsonrainville.msn.msn.repository;

import com.nicholsonrainville.msn.msn.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    @Query("SELECT n FROM Notification n WHERE n.receveurId = ?1 AND n.lu = false")
    List<Notification> getNotificationByReceveurId(Long receveurId);
}
