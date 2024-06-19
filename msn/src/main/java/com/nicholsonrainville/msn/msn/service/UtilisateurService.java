package com.nicholsonrainville.msn.msn.service;

import com.nicholsonrainville.msn.msn.entity.Utilisateur;

public interface UtilisateurService {

    boolean emailIsValid(String email);
    Utilisateur findByEmail(String email);
}
