package com.nicholsonrainville.msn.msn.controlleur;

import com.nicholsonrainville.msn.msn.entity.Utilisateur;
import com.nicholsonrainville.msn.msn.exception.domain.NotAnImageFileException;
import com.nicholsonrainville.msn.msn.service.UtilisateurService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
public class UtilisateurController {
    private final UtilisateurService utilisateurService;

    @Autowired
    public UtilisateurController(UtilisateurService utilisateurService) {
        this.utilisateurService = utilisateurService;
    }

    @PutMapping("/utilisateur/update/{userId}")
    public ResponseEntity<Utilisateur> updateUser(@RequestParam("nom") String nom,
                                                  @RequestParam("description") String description,
                                                  @RequestParam("statut") String statut,
                                                  @RequestParam(name = "avatar", required = false) MultipartFile avatar,
                                                  @RequestParam(name = "banniere", required = false) MultipartFile banniere,
                                                  @PathVariable Long userId) throws IOException, NotAnImageFileException {

        return ResponseEntity.ok(utilisateurService.update(userId, nom, description, statut, avatar, banniere));
    }

}
