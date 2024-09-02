package com.artcorp.artsync.service;

import com.artcorp.artsync.entity.ConfirmationToken;

import java.util.Date;

public interface ConfirmationTokenService {

    ConfirmationToken findByToken(String token, Date dateCourrate);

    void save(ConfirmationToken confirmationToken);

    void delete(ConfirmationToken confirmationToken);
}
