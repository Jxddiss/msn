package com.nicholsonrainville.msn.msn.controlleur;

import com.nicholsonrainville.msn.msn.domain.HttpResponse;
import com.nicholsonrainville.msn.msn.domain.UserPrincipal;
import com.nicholsonrainville.msn.msn.entity.Utilisateur;
import com.nicholsonrainville.msn.msn.exception.domain.EmailExistException;
import com.nicholsonrainville.msn.msn.exception.domain.NotAnImageFileException;
import com.nicholsonrainville.msn.msn.service.UtilisateurService;
import com.nicholsonrainville.msn.msn.utils.JWTTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

import static com.nicholsonrainville.msn.msn.constant.ExceptionConstant.EMAIL_EXIST;
import static com.nicholsonrainville.msn.msn.constant.SecurityConstant.JWT_TOKEN_HEADER;
import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;
import static org.springframework.http.HttpStatus.OK;

@RestController
public class AuthenticationController {
    private AuthenticationManager authenticationManager;
    private JWTTokenProvider jwtTokenProvider;
    private UtilisateurService utilisateurService;
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    public AuthenticationController(AuthenticationManager authenticationManager, JWTTokenProvider jwtTokenProvider, UtilisateurService utilisateurService, BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.utilisateurService = utilisateurService;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<Utilisateur> login(@RequestBody Utilisateur user){
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

    private void authenticate(String username, String password) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
    }

    private HttpHeaders getJwtHeader(UserPrincipal userPrincipal) {
        HttpHeaders headers = new HttpHeaders();
        headers.add(JWT_TOKEN_HEADER, jwtTokenProvider.generateJwtToken(userPrincipal));
        return headers;
    }
}
