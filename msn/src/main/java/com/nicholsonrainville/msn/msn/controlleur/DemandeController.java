package com.nicholsonrainville.msn.msn.controlleur;

import com.nicholsonrainville.msn.msn.entity.Demande;
import com.nicholsonrainville.msn.msn.entity.Notification;
import com.nicholsonrainville.msn.msn.entity.Utilisateur;
import com.nicholsonrainville.msn.msn.exception.domain.UserNotFoundException;
import com.nicholsonrainville.msn.msn.service.DemandeService;
import com.nicholsonrainville.msn.msn.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.util.List;

@RestController
public class DemandeController {
    private final DemandeService demandeService;
    private final NotificationService notificationService;
    private final SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    public DemandeController(DemandeService demandeService, NotificationService notificationService, SimpMessagingTemplate simpMessagingTemplate) {
        this.demandeService = demandeService;
        this.notificationService = notificationService;
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    //Ajouter authentication get principal pour verifier l'utilisateur
    @GetMapping("/demandes/{idUtilisateur}")
    public ResponseEntity<List<Demande>> getDemandesByUtilisateurs(@PathVariable Long idUtilisateur) {
        List<Demande> demandes = demandeService.getDemandesByUtilisateur(idUtilisateur);
        return new ResponseEntity<>(demandes, HttpStatus.OK);
    }

    @PutMapping("/demandes/accepter/{idDemande}")
    public ResponseEntity<Boolean> accepterDemande(@PathVariable Long idDemande, HttpMethod httpMethod) throws NoResourceFoundException {
        if (!demandeService.existsById(idDemande)) {
            throw new NoResourceFoundException(httpMethod,"La demande n'existe pas id : "+idDemande);
        }
        boolean demandeAccepter = demandeService.accepter(idDemande,true,"Accepté");
        if (!demandeAccepter) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(true, HttpStatus.OK);
    }

    @PutMapping("/demandes/refuser/{idDemande}")
    public ResponseEntity<Boolean> refuserDemande(@PathVariable Long idDemande, HttpMethod httpMethod) throws NoResourceFoundException {
        if (!demandeService.existsById(idDemande)) {
            throw new NoResourceFoundException(httpMethod,"La demande n'existe pas id : "+idDemande);
        }
        demandeService.accepter(idDemande,false,"Refusé");
        return new ResponseEntity<>(true, HttpStatus.OK);
    }

    @PostMapping("/demandes/send")
    public ResponseEntity<Demande> sendDemande(@RequestParam("emailReceveur") String emailReceveur,
                                               @RequestParam("emailEmetteur") String emailEmetteur) throws UserNotFoundException {

        Demande sendDemande = demandeService.save(emailReceveur, emailEmetteur);
        if (sendDemande == null) {
            throw new UserNotFoundException();
        }

        Notification notification = notificationService.sendNotification(sendDemande.getReceveur().getId(),
                "Demande de contact","Vous avez recu une demande de contact de "+sendDemande.getEnvoyeur().getNomComplet(),"",
                sendDemande.getEnvoyeur().getAvatar(),"msn");
        simpMessagingTemplate.convertAndSend("/topic/notification/"+sendDemande.getReceveur().getId(), notification);
        return new ResponseEntity<>(sendDemande, HttpStatus.OK);
    }
}
