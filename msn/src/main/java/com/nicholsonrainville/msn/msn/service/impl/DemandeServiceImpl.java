package com.nicholsonrainville.msn.msn.service.impl;

import com.nicholsonrainville.msn.msn.entity.Conversation;
import com.nicholsonrainville.msn.msn.entity.Demande;
import com.nicholsonrainville.msn.msn.entity.Utilisateur;
import com.nicholsonrainville.msn.msn.repository.ConversationRepository;
import com.nicholsonrainville.msn.msn.repository.DemandeRepository;
import com.nicholsonrainville.msn.msn.repository.UtilisateurRepository;
import com.nicholsonrainville.msn.msn.service.DemandeService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
@Transactional
public class DemandeServiceImpl implements DemandeService {
    private final DemandeRepository demandeRepository;
    private final ConversationRepository conversationRepository;
    private final UtilisateurRepository utilisateurRepository;

    @Autowired
    public DemandeServiceImpl(DemandeRepository demandeRepository, ConversationRepository conversationRepository, UtilisateurRepository utilisateurRepository) {
        this.demandeRepository = demandeRepository;
        this.conversationRepository = conversationRepository;
        this.utilisateurRepository = utilisateurRepository;
    }

    @Override
    public List<Demande> getDemandesByUtilisateur(Long idUtilisateur) {
        return demandeRepository.getDemandesByUtilisateurId(idUtilisateur);
    }

    @Override
    public boolean accepter(Long idDemande, Boolean accepter, String statut) {
        int result = demandeRepository.accepter(accepter, idDemande, statut);

        if(result > 0) {
            Demande demande = demandeRepository.findById(idDemande).orElse(null);
            if (demande != null && accepter) {
                Conversation conversation = new Conversation();
                conversation.setUtilisateurs(Set.of(demande.getEnvoyeur(), demande.getReceveur()));
                conversationRepository.save(conversation);
                return true;
            }
        }
        return false;
    }

    @Override
    public Demande getDemandeById(Long idDemande) {
        return demandeRepository.findById(idDemande).orElse(null);
    }


    @Override
    public boolean existsById(Long id) {
        return demandeRepository.existsById(id);
    }

    @Override
    public void delete(Demande demande) {
        demandeRepository.delete(demande);
    }

    @Override
    public Demande save(String emailReceveur, String emailEmetteur) {
        Utilisateur receveur = utilisateurRepository.findByEmail(emailReceveur);
        Utilisateur emetteur = utilisateurRepository.findByEmail(emailEmetteur);
        if (receveur != null && emetteur != null) {
            Demande demande = new Demande();
            demande.setEnvoyeur(emetteur);
            demande.setReceveur(receveur);
            demande.setStatut("En attente");
            demande.setAccepter(false);
            return demandeRepository.save(demande);
        }
        return null;
    }
}
