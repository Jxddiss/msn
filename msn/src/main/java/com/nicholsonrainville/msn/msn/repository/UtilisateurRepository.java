package com.nicholsonrainville.msn.msn.repository;

import com.nicholsonrainville.msn.msn.entity.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {
    boolean existsByEmail(String email);

    Utilisateur findByEmail(String email);

    @Modifying
    @Query("UPDATE Utilisateur u SET u.password = ?1 WHERE u.id = ?2")
    int changePassword(String password, Long id);

}
