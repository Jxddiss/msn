package com.nicholsonrainville.msn.msn.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

@Entity
public class Demande {
    @Id
    private Long id;
    @ManyToOne
    private Utilisateur receveur;
    @ManyToOne
    private Utilisateur envoyeur;
    private String statut;

    public Demande() {
    }

    public Demande(Long id, Utilisateur receveur, Utilisateur envoyeur, String statut) {
        this.id = id;
        this.receveur = receveur;
        this.envoyeur = envoyeur;
        this.statut = statut;
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
}
