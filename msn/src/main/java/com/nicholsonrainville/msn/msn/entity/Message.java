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

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }
}
