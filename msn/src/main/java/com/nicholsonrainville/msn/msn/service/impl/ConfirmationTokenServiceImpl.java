package com.artcorp.artsync.service.impl;

import com.artcorp.artsync.entity.ConfirmationToken;
import com.artcorp.artsync.repos.ConfirmationTokenRepos;
import com.artcorp.artsync.service.ConfirmationTokenService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
@Transactional
public class ConfirmationTokenServiceImpl implements ConfirmationTokenService {
    private  final ConfirmationTokenRepos confirmationTokenRepos;

    @Autowired
    public ConfirmationTokenServiceImpl(ConfirmationTokenRepos confirmationTokenRepos) {
        this.confirmationTokenRepos = confirmationTokenRepos;
    }
    @Override
    public ConfirmationToken findByToken(String token, Date dateCourrante) {
        return confirmationTokenRepos.findByToken(token, dateCourrante);
    }

    @Override
    public void save(ConfirmationToken confirmationToken){
        confirmationTokenRepos.save(confirmationToken);
    }

    @Override
    public void delete(ConfirmationToken confirmationToken) {
        confirmationTokenRepos.delete(confirmationToken);
    }
}
