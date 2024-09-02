package com.artcorp.artsync.service;

import com.sun.mail.smtp.SMTPTransport;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.util.Date;
import java.util.Properties;

import static com.artcorp.artsync.constant.EmailConstant.*;
import static javax.mail.Message.RecipientType.CC;
import static javax.mail.Message.RecipientType.TO;

@Service
public class EmailService {
    @Async
    public void sendPasswordChangeLink(String lien, String email) throws MessagingException {
        Message message = createEmail(lien,email);
        SMTPTransport smtpTransport = (SMTPTransport) getEmailSession().getTransport(SIMPLE_MAIL_PROTOCOL);
        smtpTransport.connect(GMAIL_SMTP_SERVER,USERNAME,PASSWORD);
        smtpTransport.sendMessage(message,message.getAllRecipients());
        smtpTransport.close();
    }

    private Message createEmail( String lien, String email) throws MessagingException {
        Message message = new MimeMessage(getEmailSession());
        message.setFrom(new InternetAddress(FROM_EMAIL));
        message.setRecipients(TO, InternetAddress.parse(email,false));
        message.setRecipients(CC,InternetAddress.parse(CC_EMAIL,false));
        message.setSubject(EMAIL_SUBJECT);
        message.setText("Bonjour cher artiste,"
                +"\n\n Voici le lien pour changer votre mot de passe : \n"+lien
                +"\n\n L'équipe de support d'ArtSync");
        message.setSentDate(new Date());
        message.saveChanges();
        return message;
    }

    private Session getEmailSession(){
        Properties properties = System.getProperties();
        properties.put(SMTP_HOST,GMAIL_SMTP_SERVER);
        properties.put(SMTP_AUTH,true);
        properties.put(SMTP_PORT,DEFAULT_PORT);
        properties.put(SMTP_STARTTLS_ENABLE,true);
        properties.put(SMTP_STARTTLS_REQUIRED,true);
        return Session.getInstance(properties,null);
    }
}
