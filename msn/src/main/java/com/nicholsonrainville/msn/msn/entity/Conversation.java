package com.nicholsonrainville.msn.msn.entity;

import jakarta.persistence.*;

import java.util.Set;

@Entity
public class Conversation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToMany
    private Set<Utilisateur> utilisateurs;
    @OneToMany
    private Set<Message> messages;

    public Conversation() {
    }

    public Conversation(Long id, Set<Utilisateur> utilisateurs, Set<Message> messages) {
        this.id = id;
        this.utilisateurs = utilisateurs;
        this.messages = messages;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public Set<Utilisateur> getUtilisateurs() {
        return utilisateurs;
    }

    public void setUtilisateurs(Set<Utilisateur> utilisateurs) {
        this.utilisateurs = utilisateurs;
    }

    public Set<Message> getMessages() {
        return messages;
    }

    public void setMessages(Set<Message> messages) {
        this.messages = messages;
    }
}
