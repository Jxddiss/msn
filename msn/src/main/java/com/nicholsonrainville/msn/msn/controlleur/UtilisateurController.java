package com.nicholsonrainville.msn.msn.controlleur;

import com.nicholsonrainville.msn.msn.domain.HttpResponse;
import com.nicholsonrainville.msn.msn.entity.Utilisateur;
import com.nicholsonrainville.msn.msn.exception.domain.NotAnImageFileException;
import com.nicholsonrainville.msn.msn.service.UtilisateurService;
import com.nicholsonrainville.msn.msn.service.impl.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.mail.MessagingException;
import java.io.IOException;

import static com.nicholsonrainville.msn.msn.constant.EmailConstant.MESSAGE_INVITATION_HTTP;
import static org.springframework.http.HttpStatus.OK;

@RestController
public class UtilisateurController {
    private final UtilisateurService utilisateurService;
    private final EmailService emailService;

    @Autowired
    public UtilisateurController(UtilisateurService utilisateurService, EmailService emailService) {
        this.utilisateurService = utilisateurService;
        this.emailService = emailService;
    }

    @PutMapping("/utilisateur/update/{userId}")
    public ResponseEntity<Utilisateur> updateUser(@RequestParam("nom") String nom,
                                                  @RequestParam("description") String description,
                                                  @RequestParam("statut") String statut,
                                                  @RequestParam(name = "avatar", required = false) MultipartFile avatar,
                                                  @RequestParam(name = "banniere", required = false) MultipartFile banniere,
                                                  @PathVariable Long userId) throws IOException, NotAnImageFileException {
        System.out.println("utilisateur update");
        return ResponseEntity.ok(utilisateurService.update(userId, nom, description, statut, avatar, banniere));
    }

    @PostMapping("/invite")
    public ResponseEntity<HttpResponse> invite(@RequestParam("email") String email) throws MessagingException {
        emailService.sendInvitation(email);
        return ResponseEntity.ok(new HttpResponse(OK.value(),OK,OK.getReasonPhrase(),MESSAGE_INVITATION_HTTP));
    }
}
