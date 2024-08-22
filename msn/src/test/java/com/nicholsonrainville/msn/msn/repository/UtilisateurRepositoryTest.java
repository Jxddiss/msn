package com.nicholsonrainville.msn.msn.repository;

import com.nicholsonrainville.msn.msn.entity.Utilisateur;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.annotation.Rollback;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Rollback(false)
class UtilisateurRepositoryTest {
    @Autowired
    private UtilisateurRepository utilisateurRepository;
    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Test
    public void testCreateOneUtilisateur(){
        Utilisateur utilisateur = new Utilisateur();
        utilisateur.setNomComplet("Nicholson R");
        utilisateur.setActive(true);
        utilisateur.setEmail("email@example.com");
        utilisateur.setAvatar("assets/images/buddy2.png");
        utilisateur.setBanniere("assets/images/default.png");
        utilisateur.setDescription("Hello je suis "+utilisateur.getNomComplet());
        utilisateur.setRoleName("ROLE_USER");
        utilisateur.setStatut("online");
        utilisateur.setLocked(false);
        utilisateur.setPassword(bCryptPasswordEncoder.encode("123"));

        Utilisateur savedUser = utilisateurRepository.save(utilisateur);
        assertThat(savedUser.getId()).isGreaterThan(0);

    }

    @Test
    public void resetPassword(){
        String password = "123";
        List<Utilisateur> users = utilisateurRepository.findAll();
        for(Utilisateur user : users){
            user.setPassword(bCryptPasswordEncoder.encode(password));
            utilisateurRepository.save(user);
        }
    }
}