package com.artcorp.artsync.repos;

import com.artcorp.artsync.entity.ConfirmationToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;

@Repository
public interface ConfirmationTokenRepos extends JpaRepository<ConfirmationToken, Long> {

    @Query("SELECT c FROM ConfirmationToken c WHERE c.token = ?1 AND c.dateExpiration > ?2 ")
    ConfirmationToken findByToken(String token, Date dateCourrante);

}
