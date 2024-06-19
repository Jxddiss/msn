package com.nicholsonrainville.msn.msn.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

@Entity
public class Notification {
    @Id
    private Long id;
    private String titre;
    private String message;
    private String lien;
    private String image;
    private String type;
    private Boolean lu;
    private Long receveurId;
    public Notification() {
    }

    public Notification(Long id, String titre, String message, String lien, String image, String type, Boolean lu, Long receveurId) {
        this.id = id;
        this.titre = titre;
        this.message = message;
        this.lien = lien;
        this.image = image;
        this.type = type;
        this.lu = lu;
        this.receveurId = receveurId;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public String getTitre() {
        return titre;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getLien() {
        return lien;
    }

    public void setLien(String lien) {
        this.lien = lien;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Boolean getLu() {
        return lu;
    }

    public void setLu(Boolean lu) {
        this.lu = lu;
    }

    public Long getReceveurId() {
        return receveurId;
    }

    public void setReceveurId(Long receveurId) {
        this.receveurId = receveurId;
    }
}
