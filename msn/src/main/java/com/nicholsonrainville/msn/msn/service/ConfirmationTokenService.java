package com.nicholsonrainville.msn.msn.service;

import com.nicholsonrainville.msn.msn.entity.ConfirmationToken;

import java.util.Date;

public interface ConfirmationTokenService {

    ConfirmationToken findByToken(String token, Date dateCourrate);

    void save(ConfirmationToken confirmationToken);

    void delete(ConfirmationToken confirmationToken);
}
