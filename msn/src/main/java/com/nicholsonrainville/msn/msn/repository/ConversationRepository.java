package com.nicholsonrainville.msn.msn.repository;

import com.nicholsonrainville.msn.msn.entity.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation,Long> {
}
