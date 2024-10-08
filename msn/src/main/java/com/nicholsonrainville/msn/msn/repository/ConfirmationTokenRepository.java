package com.nicholsonrainville.msn.msn.repository;

import com.nicholsonrainville.msn.msn.entity.ConfirmationToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;

@Repository
public interface ConfirmationTokenRepository extends JpaRepository<ConfirmationToken, Long> {

    @Query("SELECT c FROM ConfirmationToken c WHERE c.token = ?1 AND c.dateExpiration > ?2 ")
    ConfirmationToken findByToken(String token, Date dateCourrante);

}
