package com.nicholsonrainville.msn.msn.service.impl;

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

import static com.nicholsonrainville.msn.msn.constant.EmailConstant.*;
import static javax.mail.Message.RecipientType.CC;
import static javax.mail.Message.RecipientType.TO;

@Service
public class EmailService {
    @Async
    public void sendPasswordChangeLink(String lien, String email) throws MessagingException {
        Message message = createEmail(lien,email);
        SMTPTransport smtpTransport = (SMTPTransport) getEmailSession().getTransport(SIMPLE_MAIL_PROTOCOL);
        smtpTransport.connect(SMTP_SENDGRID_NET,USERNAME,PASSWORD);
        smtpTransport.sendMessage(message,message.getAllRecipients());
        smtpTransport.close();
    }

    @Async
    public void sendInvitation(String email) throws MessagingException {
        Message message = createEmailInvitation(email);
        SMTPTransport smtpTransport = (SMTPTransport) getEmailSession().getTransport(SIMPLE_MAIL_PROTOCOL);
        smtpTransport.connect(SMTP_SENDGRID_NET,USERNAME,PASSWORD);
        smtpTransport.sendMessage(message,message.getAllRecipients());
        smtpTransport.close();
    }

    private Message createEmail( String lien, String email) throws MessagingException {
        Message message = new MimeMessage(getEmailSession());
        message.setFrom(new InternetAddress(FROM_EMAIL));
        message.setRecipients(TO, InternetAddress.parse(email,false));
        message.setRecipients(CC,InternetAddress.parse(CC_EMAIL,false));
        message.setSubject(EMAIL_SUBJECT);
        message.setText("Bonjour cher utilisateur,"
                +"\n\n Voici le lien pour changer votre mot de passe : \n"+lien
                +"\n\n L'équipe de support de Michelsoft Bimbows");
        message.setSentDate(new Date());
        message.saveChanges();
        return message;
    }

    private Message createEmailInvitation(String email) throws MessagingException {
        Message message = new MimeMessage(getEmailSession());
        message.setFrom(new InternetAddress(FROM_EMAIL));
        message.setRecipients(TO, InternetAddress.parse(email,false));
        message.setRecipients(CC,InternetAddress.parse(CC_EMAIL,false));
        message.setSubject(EMAIL_SUBJECT_INVITATION);
        message.setText("Bonjour ,"
                +"\n\n Votre amis vous invite à rejoindre Michelsoft live Messenger : \n"+LIEN_INVITATION
                +"\n\n L'équipe de support de Michelsoft Bimbows");
        message.setSentDate(new Date());
        message.saveChanges();
        return message;
    }

    private Session getEmailSession(){
        Properties properties = System.getProperties();
        properties.put(SMTP_HOST, SMTP_SENDGRID_NET);
        properties.put(SMTP_AUTH,true);
        properties.put(SMTP_PORT,DEFAULT_PORT);
        properties.put(SMTP_STARTTLS_ENABLE,true);
        properties.put(SMTP_STARTTLS_REQUIRED,true);
        return Session.getInstance(properties,null);
    }
}
