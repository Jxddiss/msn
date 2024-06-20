package com.nicholsonrainville.msn.msn.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String contenu;
    private LocalDateTime date;
    @Column(nullable = false)
    private String nomSender;
    @Column(nullable = false)
    private String type;
    private String style;
    private String winkName;
    @ManyToOne
    private Conversation conversation;

    public Message(Conversation conversation) {
        this.conversation = conversation;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public String getContenu() {
        return contenu;
    }

    public void setContenu(String contenu) {
        this.contenu = contenu;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public String getNomSender() {
        return nomSender;
    }

    public void setNomSender(String nomSender) {
        this.nomSender = nomSender;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getStyle() {
        return style;
    }

    public void setStyle(String style) {
        this.style = style;
    }

    public String getWinkName() {
        return winkName;
    }

    public void setWinkName(String winkName) {
        this.winkName = winkName;
    }

    public Conversation getConversation() {
        return conversation;
    }

    public void setConversation(Conversation conversation) {
        this.conversation = conversation;
    }
}
