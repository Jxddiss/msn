package com.nicholsonrainville.msn.msn.service.impl;

import com.nicholsonrainville.msn.msn.domain.UserPrincipal;
import com.nicholsonrainville.msn.msn.entity.Utilisateur;
import com.nicholsonrainville.msn.msn.exception.domain.NotAnImageFileException;
import com.nicholsonrainville.msn.msn.repository.UtilisateurRepository;
import com.nicholsonrainville.msn.msn.service.UtilisateurService;
import com.nicholsonrainville.msn.msn.utils.FileVerification;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.UUID;

import static com.nicholsonrainville.msn.msn.constant.ExceptionConstant.NOT_AN_IMAGE_FILE;
import static com.nicholsonrainville.msn.msn.constant.FileConstant.*;
import static org.springframework.http.MediaType.*;

@Service
@Transactional
public class UtilisateurServiceImpl implements UtilisateurService, UserDetailsService {
    private final UtilisateurRepository utilisateurRepository;
    private final Logger LOGGER = LoggerFactory.getLogger(getClass());
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public UtilisateurServiceImpl(UtilisateurRepository utilisateurRepository, BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.utilisateurRepository = utilisateurRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
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

    @Override
    public Utilisateur findByEmail(String email) {
        return utilisateurRepository.findByEmail(email);
    }

    @Override
    public Utilisateur save(Utilisateur utilisateur) {
        return utilisateurRepository.save(utilisateur);
    }

    @Override
    public Utilisateur inscription(String email, String nom, String password, MultipartFile avatar) throws NotAnImageFileException, IOException {
        Utilisateur utilisateur = new Utilisateur();
        utilisateur.setEmail(email);
        utilisateur.setNomComplet(nom);
        utilisateur.setLocked(false);
        utilisateur.setActive(true);
        utilisateur.setBanniere("assets/images/default.png");
        utilisateur.setDescription("Hello je suis "+nom);
        utilisateur.setRoleName("ROLE_USER");
        utilisateur.setStatut("online");
        utilisateur.setPassword(bCryptPasswordEncoder.encode(password));

        if (avatar != null){
            Utilisateur updatedUtilisateur = saveAvatar(utilisateur, avatar);
            return save(updatedUtilisateur);
        }else{
            utilisateur.setAvatar("assets/images/buddy2.png");
        }

        return save(utilisateur);
    }

    @Override
    public Utilisateur update(Long userId,
                              String nom,
                              String description,
                              String statut,
                              MultipartFile avatar,
                              MultipartFile banniere) throws NotAnImageFileException, IOException {

        Utilisateur utilisateur = utilisateurRepository.findById(userId).orElse(null);
        if (utilisateur != null){
            if (avatar != null){
                saveAvatar(utilisateur, avatar);
            }
            if (banniere != null){
                saveBanniere(utilisateur, banniere);
            }
            utilisateur.setNomComplet(nom);
            utilisateur.setDescription(description);
            utilisateur.setStatut(statut);
            return save(utilisateur);
        }
        return null;
    }

    @Override
    public void logout(String email) {
        Utilisateur utilisateur = findByEmail(email);
        if (utilisateur != null){
            utilisateurRepository.changeStatut("disconnected", utilisateur.getId());
        }
    }

    @Override
    public void changeStatut(String statut, Long id) {
        Utilisateur utilisateur = utilisateurRepository.findById(id).orElse(null);
        if (utilisateur != null){
            utilisateurRepository.changeStatut(statut, id);
        }
    }

    @Override
    public boolean validateUser(String email, Long id) {
        Utilisateur utilisateur = findByEmail(email);
        if (utilisateur != null && utilisateur.getId().equals(id)){
            return true;
        }
        return false;
    }

    private Utilisateur saveAvatar(Utilisateur utilisateur, MultipartFile avatar) throws NotAnImageFileException, IOException {
        String finalName = saveImage(avatar);
        utilisateur.setAvatar(BASE_URL_PROFILE+finalName);
        return utilisateur;
    }

    private Utilisateur saveBanniere(Utilisateur utilisateur, MultipartFile banniere) throws NotAnImageFileException, IOException {
        String finalName = saveImage(banniere);
        utilisateur.setBanniere(BASE_URL_BANNIERE+finalName);
        return utilisateur;
    }

    private String saveImage(MultipartFile banniere) throws NotAnImageFileException, IOException {
        if(!FileVerification.verifyFile(banniere)){
            throw new NotAnImageFileException(banniere.getOriginalFilename() + NOT_AN_IMAGE_FILE);
        }
        String originalFilename = StringUtils.cleanPath(banniere.getOriginalFilename());
        String finalName = UUID.randomUUID().toString().replace("-","") +"."+originalFilename.split("\\.")[1];
        File parentDir = new File(USER_FOLDER);
        File saveFile = new File(parentDir.getAbsolutePath() + File.separator + finalName);
        Files.copy(banniere.getInputStream(),saveFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
        banniere.getInputStream().close();

        return finalName;
    }
}
