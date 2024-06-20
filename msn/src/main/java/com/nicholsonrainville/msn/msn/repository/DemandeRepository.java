package com.nicholsonrainville.msn.msn.repository;

import com.nicholsonrainville.msn.msn.entity.Demande;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DemandeRepository extends JpaRepository<Demande,Long> {

    @Query("SELECT d FROM Demande d WHERE d.receveur.id = ?1 OR d.envoyeur.id = ?1")
    List<Demande> getDemandesByUtilisateurId(Long idUtilisateur);
    @Modifying
    @Query("UPDATE Demande d SET d.accepter = ?1, d.statut = ?3 WHERE d.id = ?2")
    int accepter(Boolean accepter, Long id, String statut);
    boolean existsById(Long id);
}
