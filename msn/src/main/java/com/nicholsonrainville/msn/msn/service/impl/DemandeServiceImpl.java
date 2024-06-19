package com.nicholsonrainville.msn.msn.service.impl;

import com.nicholsonrainville.msn.msn.entity.Conversation;
import com.nicholsonrainville.msn.msn.entity.Demande;
import com.nicholsonrainville.msn.msn.repository.ConversationRepository;
import com.nicholsonrainville.msn.msn.repository.DemandeRepository;
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

    @Autowired
    public DemandeServiceImpl(DemandeRepository demandeRepository, ConversationRepository conversationRepository) {
        this.demandeRepository = demandeRepository;
        this.conversationRepository = conversationRepository;
    }

    @Override
    public List<Demande> getDemandesByUtilisateur(Long idUtilisateur) {
        return demandeRepository.getDemandesByUtilisateurId(idUtilisateur);
    }

    @Override
    public boolean accepter(Long idDemande, Boolean accepter) {
        Long result = demandeRepository.accepter(accepter, idDemande, "Accepte");

        if(result > 0) {
            Demande demande = demandeRepository.findById(idDemande).orElse(null);
            if (demande != null) {
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
    public void delete(Demande demande) {
        demandeRepository.delete(demande);
    }

    @Override
    public Demande save(Demande demande) {
        return demandeRepository.save(demande);
    }
}
