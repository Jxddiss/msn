package com.nicholsonrainville.msn.msn.service;

import com.nicholsonrainville.msn.msn.entity.Message;
import com.nicholsonrainville.msn.msn.exception.domain.NotAnImageFileException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface MessageService {
    Message save(Message message);
    Message saveImage(Message message, MultipartFile image) throws IOException, NotAnImageFileException;
}
