package com.nicholsonrainville.msn.msn.service.impl;

import com.nicholsonrainville.msn.msn.entity.ConfirmationToken;
import com.nicholsonrainville.msn.msn.repository.ConfirmationTokenRepository;
import com.nicholsonrainville.msn.msn.service.ConfirmationTokenService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
@Transactional
public class ConfirmationTokenServiceImpl implements ConfirmationTokenService {
    private  final ConfirmationTokenRepository confirmationTokenRepos;

    @Autowired
    public ConfirmationTokenServiceImpl(ConfirmationTokenRepository confirmationTokenRepos) {
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
