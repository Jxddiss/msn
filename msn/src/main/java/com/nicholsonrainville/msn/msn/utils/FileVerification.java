package com.nicholsonrainville.msn.msn.utils;

import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;

import static org.springframework.http.MediaType.*;

public class FileVerification {
    public static boolean verifyFile(MultipartFile file) {
        boolean valide = false;

        if(Arrays.asList(IMAGE_JPEG_VALUE, IMAGE_PNG_VALUE, IMAGE_GIF_VALUE).contains(file.getContentType())){
            valide = true;
        }

        return valide;
    }
}
