package com.nicholsonrainville.msn.msn.exception;

import com.nicholsonrainville.msn.msn.domain.HttpResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import static com.nicholsonrainville.msn.msn.constant.ExceptionConstant.MAUVAIS_IDENTIFIANTS;
import static com.nicholsonrainville.msn.msn.constant.ExceptionConstant.UNE_ERREUR_EST_SURVENUE;
import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;

@RestControllerAdvice
public class ExceptionHandling {
    public final Logger LOGGER = LoggerFactory.getLogger(getClass());
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<HttpResponse> badCredentialsException() {
        return createHttpResponse(BAD_REQUEST, MAUVAIS_IDENTIFIANTS);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<HttpResponse> internalServerErrorException(Exception ex) {
        LOGGER.error(ex.getMessage());
        return createHttpResponse(INTERNAL_SERVER_ERROR, UNE_ERREUR_EST_SURVENUE);
    }

    private ResponseEntity<HttpResponse> createHttpResponse(HttpStatus httpStatus, String message) {
        return new ResponseEntity<>(new HttpResponse(httpStatus.value(), httpStatus,
                httpStatus.getReasonPhrase(), message), httpStatus);
    }
}
