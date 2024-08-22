package com.nicholsonrainville.msn.msn.service.impl;

import com.nicholsonrainville.msn.msn.constant.FileConstant;
import com.nicholsonrainville.msn.msn.entity.Conversation;
import com.nicholsonrainville.msn.msn.entity.Message;
import com.nicholsonrainville.msn.msn.exception.domain.NotAnImageFileException;
import com.nicholsonrainville.msn.msn.repository.ConversationRepository;
import com.nicholsonrainville.msn.msn.repository.MessageRepository;
import com.nicholsonrainville.msn.msn.service.MessageService;
import com.nicholsonrainville.msn.msn.utils.FileVerification;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import static com.nicholsonrainville.msn.msn.constant.ExceptionConstant.NOT_AN_IMAGE_FILE;

@Service
@Transactional
public class MessageServiceImpl implements MessageService {

    private final MessageRepository messageRepository;
    private final ConversationRepository conversationRepository;

    @Autowired
    public MessageServiceImpl(MessageRepository messageRepository, ConversationRepository conversationRepository) {
        this.messageRepository = messageRepository;
        this.conversationRepository = conversationRepository;
    }

    @Override
    public Message save(Message message) {
        return messageRepository.save(message);
    }

    @Override
    public Message saveImage(Message message, MultipartFile image) throws IOException, NotAnImageFileException {
        if(!FileVerification.verifyFile(image)){
            throw new NotAnImageFileException(NOT_AN_IMAGE_FILE);
        }

        String OriginalFilename = StringUtils.cleanPath(image.getOriginalFilename());
        String finalFilename = UUID.randomUUID().toString() + "_" + OriginalFilename;
        File parentDir = new File(FileConstant.MEDIA_CHAT_BASE_FOLDER);
        if(!parentDir.exists()){
            parentDir.mkdir();
        }
        File saveFile = new File(parentDir.getAbsolutePath() + File.separator + finalFilename);
        Files.copy(image.getInputStream(), saveFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
        message.setContenu(FileConstant.BASE_URL_CHAT + finalFilename);
        message = save(message);
        return message;
    }
}
