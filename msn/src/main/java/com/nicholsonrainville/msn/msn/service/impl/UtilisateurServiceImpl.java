package com.nicholsonrainville.msn.msn.service.impl;

import com.nicholsonrainville.msn.msn.domain.UserPrincipal;
import com.nicholsonrainville.msn.msn.entity.Utilisateur;
import com.nicholsonrainville.msn.msn.repository.UtilisateurRepository;
import com.nicholsonrainville.msn.msn.service.UtilisateurService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

public class UtilisateurServiceImpl implements UtilisateurService, UserDetailsService {
    private final UtilisateurRepository utilisateurRepository;
    private final Logger LOGGER = LoggerFactory.getLogger(getClass());

    public UtilisateurServiceImpl(UtilisateurRepository utilisateurRepository) {
        this.utilisateurRepository = utilisateurRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Utilisateur user = utilisateurRepository.findByEmail(username);
        if (user == null){
            LOGGER.error("Utilisateur non trouvé avec le email : "+username);
        }
        UserPrincipal userPrincipal = new UserPrincipal(user);

        return userPrincipal;
    }

    @Override
    public boolean emailIsValid(String email) {
        return !utilisateurRepository.existsByEmail(email);
    }
}
