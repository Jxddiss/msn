package com.nicholsonrainville.msn.msn.entity;

import jakarta.persistence.*;

import java.util.Date;

@Entity
public class ConfirmationToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private Long userId;
    @Column(unique = true,nullable = false)
    private String token;
    @Column(nullable = false)
    private String type;
    @Column(nullable = false)
    private Date dateExpiration;

    public ConfirmationToken() {
    }

    public ConfirmationToken(Long id, Long userId, String token, String type, Date dateExpiration) {
        this.id = id;
        this.userId = userId;
        this.token = token;
        this.type = type;
        this.dateExpiration = dateExpiration;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Date getDateExpiration() {
        return dateExpiration;
    }

    public void setDateExpiration(Date date) {
        this.dateExpiration = date;
    }
}

