package com.nicholsonrainville.msn.msn.service;

import com.nicholsonrainville.msn.msn.entity.Demande;

import java.util.List;

public interface DemandeService {
    List<Demande> getDemandesByUtilisateur(Long idUtilisateur);
    boolean accepter(Long idDemande, Boolean accepter, String statut);
    Demande getDemandeById(Long idDemande);
    void delete(Demande demande);
    Demande save(String emailReceveur, String emailEmetteur);
    boolean existsById(Long id);
}
