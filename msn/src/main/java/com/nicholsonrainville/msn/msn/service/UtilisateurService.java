package com.nicholsonrainville.msn.msn.service;

import com.nicholsonrainville.msn.msn.entity.Utilisateur;
import com.nicholsonrainville.msn.msn.exception.domain.NotAnImageFileException;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface UtilisateurService {

    boolean emailIsValid(String email);
    Utilisateur findByEmail(String email);
    Utilisateur save(Utilisateur utilisateur);
    Utilisateur inscription( String email,
                             String nom,
                             String password,
                             MultipartFile avatar) throws NotAnImageFileException, IOException;
    Utilisateur update(Long userId,
                       String nom,
                       String description,
                       String statut,
                       MultipartFile avatar,
                       MultipartFile banniere) throws NotAnImageFileException, IOException;

    void logout(String email);
}
