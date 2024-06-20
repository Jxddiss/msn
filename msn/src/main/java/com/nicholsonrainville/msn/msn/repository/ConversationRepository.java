package com.nicholsonrainville.msn.msn.repository;

import com.nicholsonrainville.msn.msn.entity.Conversation;
import com.nicholsonrainville.msn.msn.entity.Message;
import com.nicholsonrainville.msn.msn.entity.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation,Long> {

    @Query("SELECT c FROM Conversation c JOIN c.utilisateurs u WHERE u.id = ?1")
    List<Conversation> getConversationByUtilisateurs(Long idUtilisateur);

    boolean existsById(Long id);
}
