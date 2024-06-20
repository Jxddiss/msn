package com.nicholsonrainville.msn.msn.entity;

import jakarta.persistence.*;

@Entity
public class Demande {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    private Utilisateur receveur;
    @ManyToOne
    private Utilisateur envoyeur;
    private String statut;
    private Boolean accepter;

    public Demande() {
    }

    public Demande(Long id, Utilisateur receveur, Utilisateur envoyeur, String statut, Boolean accepter) {
        this.id = id;
        this.receveur = receveur;
        this.envoyeur = envoyeur;
        this.statut = statut;
        this.accepter = accepter;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public Utilisateur getReceveur() {
        return receveur;
    }

    public void setReceveur(Utilisateur receveur) {
        this.receveur = receveur;
    }

    public Utilisateur getEnvoyeur() {
        return envoyeur;
    }

    public void setEnvoyeur(Utilisateur envoyeur) {
        this.envoyeur = envoyeur;
    }

    public String getStatut() {
        return statut;
    }

    public void setStatut(String statut) {
        this.statut = statut;
    }

    public Boolean getAccepter() {
        return accepter;
    }

    public void setAccepter(Boolean accepter) {
        this.accepter = accepter;
    }
}
