package com.nicholsonrainville.msn.msn.entity;

import jakarta.persistence.*;

@Entity
public class Utilisateur {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String nomComplet;
    @Column(nullable = false)
    private String email;
    @Column(nullable = false)
    private String statut;
    @Column(nullable = false)
    private String description;
    @Column(nullable = false)
    private String password;
    @Column(nullable = false)
    private String avatar;
    @Column(nullable = false)
    private String banniere;
    @Column(nullable = false)
    private boolean isActive;
    @Column(nullable = false)
    private boolean isLocked;
    private String roleName;

    public Utilisateur() {
    }

    public Utilisateur(Long id, String nomComplet, String email, String statut, String description, String password, String avatar, String banniere, boolean isActive, boolean isLocked, String roleName) {
        this.id = id;
        this.nomComplet = nomComplet;
        this.email = email;
        this.statut = statut;
        this.description = description;
        this.password = password;
        this.avatar = avatar;
        this.banniere = banniere;
        this.isActive = isActive;
        this.isLocked = isLocked;
        this.roleName = roleName;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public String getNomComplet() {
        return nomComplet;
    }

    public void setNomComplet(String nomComplet) {
        this.nomComplet = nomComplet;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getStatut() {
        return statut;
    }

    public void setStatut(String statut) {
        this.statut = statut;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public String getBanniere() {
        return banniere;
    }

    public void setBanniere(String banniere) {
        this.banniere = banniere;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public boolean isLocked() {
        return isLocked;
    }

    public void setLocked(boolean locked) {
        isLocked = locked;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }
}
