package com.nicholsonrainville.msn.msn.controlleur;

import com.nicholsonrainville.msn.msn.domain.HttpResponse;
import com.nicholsonrainville.msn.msn.domain.UserPrincipal;
import com.nicholsonrainville.msn.msn.entity.Utilisateur;
import com.nicholsonrainville.msn.msn.exception.domain.EmailExistException;
import com.nicholsonrainville.msn.msn.exception.domain.NotAnImageFileException;
import com.nicholsonrainville.msn.msn.exception.domain.TokenNotFound;
import com.nicholsonrainville.msn.msn.exception.domain.UserNotFoundException;
import com.nicholsonrainville.msn.msn.service.UtilisateurService;
import com.nicholsonrainville.msn.msn.service.impl.ConfirmationTokenServiceImpl;
import com.nicholsonrainville.msn.msn.service.impl.EmailService;
import com.nicholsonrainville.msn.msn.utils.JWTTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.mail.MessagingException;
import java.io.IOException;

import static com.nicholsonrainville.msn.msn.constant.ExceptionConstant.EMAIL_EXIST;
import static com.nicholsonrainville.msn.msn.constant.SecurityConstant.JWT_TOKEN_HEADER;
import static org.springframework.http.HttpStatus.*;

@RestController
public class AuthenticationController {
    public static final String ENVOYE_A_VOTRE_EMAIL = "Un lien de changement de mot de passe a été envoyé à votre email, " +
            "veuillez verifier votre boîte de pourriel si vous n'avez pas recu de lien";
    public static final String MIS_A_JOUR = "Mot de passe mis à jour";
    public static final String REESSAYER = "Le mot de passe n'a pas pu être mis à jour, veuillez reessayer";
    public static final String ERREUR_AVEC_LE_LIEN = "Une erreur c'est produite avec le lien";
    private final AuthenticationManager authenticationManager;
    private final JWTTokenProvider jwtTokenProvider;
    private final UtilisateurService utilisateurService;
    private final EmailService emailService;

    @Autowired
    public AuthenticationController(AuthenticationManager authenticationManager, JWTTokenProvider jwtTokenProvider, UtilisateurService utilisateurService, ConfirmationTokenServiceImpl confirmationTokenService, EmailService emailService, BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.utilisateurService = utilisateurService;
        this.emailService = emailService;
    }

    @PostMapping("/login")
    public ResponseEntity<Utilisateur> login(@RequestBody Utilisateur user) throws UserNotFoundException {
        if (utilisateurService.emailIsValid(user.getEmail())){
            throw new UserNotFoundException();
        }
        authenticate(user.getEmail(), user.getPassword());
        Utilisateur loginUser = utilisateurService.findByEmail(user.getEmail());
        if(user.getStatut() != null){
            if (!user.getStatut().isEmpty()){
                loginUser.setStatut(user.getStatut());
                loginUser = utilisateurService.save(loginUser);
            }
        }

        UserPrincipal userPrincipal = new UserPrincipal(loginUser);
        HttpHeaders jwtHeader = getJwtHeader(userPrincipal);
        return new ResponseEntity<>(loginUser,jwtHeader, OK);
    }

    @PostMapping("/inscription")
    public ResponseEntity<HttpResponse> inscription(@RequestParam("email") String email,
                                                    @RequestParam("nom") String nom,
                                                    @RequestParam("password") String password,
                                                    @RequestParam(name = "avatar",required = false) MultipartFile avatar)
            throws IOException, NotAnImageFileException, EmailExistException {

        if (!utilisateurService.emailIsValid(email)){
            throw new EmailExistException(EMAIL_EXIST);
        }

        Utilisateur savedUser = utilisateurService.inscription(email,nom,password,avatar);

        if(savedUser != null){
            HttpResponse httpResponse = new HttpResponse(OK.value(),OK,OK.getReasonPhrase(),"Compte créer avec succès");
            return new ResponseEntity<>(httpResponse,OK);
        }else{
            HttpResponse httpResponse = new HttpResponse(
                    INTERNAL_SERVER_ERROR.value(),
                    INTERNAL_SERVER_ERROR,
                    INTERNAL_SERVER_ERROR.getReasonPhrase(),"Une erreur est survenu");
            return new ResponseEntity<>(httpResponse,INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/logout/{email}")
    public ResponseEntity<Utilisateur> logout(@AuthenticationPrincipal String email, @PathVariable("email") String emailPath) {
        if (email != null && email.equals(emailPath)) {
            utilisateurService.logout(email);
        }
        return new ResponseEntity<>(OK);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<HttpResponse> resetPassword(@RequestParam("email") String email) throws MessagingException {
        String link = utilisateurService.generateResetTokenAndLink(email);
        if (link != null && !link.isEmpty()){
            emailService.sendPasswordChangeLink(link,email);
            return new ResponseEntity<>(
                    new HttpResponse(OK.value(),OK,OK.getReasonPhrase(),
                            ENVOYE_A_VOTRE_EMAIL),OK);
        }
        return new ResponseEntity<>(new HttpResponse(OK.value(),OK,
                OK.getReasonPhrase(),ENVOYE_A_VOTRE_EMAIL + "!"),OK);
    }

    @PutMapping("/change-password")
    public ResponseEntity<HttpResponse> changePassword(@RequestParam("token") String token,
                                                      @RequestParam("newPassword") String newPassword,
                                                      @RequestParam("confirmPassword") String confirmPassword) throws TokenNotFound {
        if (token != null && !token.isEmpty()
                && newPassword != null && !newPassword.isEmpty()
                && confirmPassword != null && !confirmPassword.isEmpty()){
            if(utilisateurService.changePasswordFromResetToken(token, newPassword, confirmPassword)){
                return new ResponseEntity<>(new HttpResponse(OK.value(),OK,OK.getReasonPhrase(), MIS_A_JOUR),OK);
            }else{
                return new ResponseEntity<>(new HttpResponse(BAD_REQUEST.value(),BAD_REQUEST,BAD_REQUEST.getReasonPhrase(), REESSAYER),OK);
            }
        }
        return new ResponseEntity<>(new HttpResponse(BAD_REQUEST.value(),BAD_REQUEST,BAD_REQUEST.getReasonPhrase(), ERREUR_AVEC_LE_LIEN),OK);
    }

    private void authenticate(String username, String password) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
    }

    private HttpHeaders getJwtHeader(UserPrincipal userPrincipal) {
        HttpHeaders headers = new HttpHeaders();
        headers.add(JWT_TOKEN_HEADER, jwtTokenProvider.generateJwtToken(userPrincipal));
        return headers;
    }
}
