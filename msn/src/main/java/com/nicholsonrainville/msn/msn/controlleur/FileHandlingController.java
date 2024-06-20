package com.nicholsonrainville.msn.msn.controlleur;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.io.IOException;
import java.net.URLConnection;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import static com.nicholsonrainville.msn.msn.constant.FileConstant.USER_FOLDER;

@RestController
public class FileHandlingController {

    @GetMapping("/media/image/utilisateur/{image}")
    public ResponseEntity<FileSystemResource> getImageProfile(@PathVariable("image") String fileName, HttpServletResponse response) throws IOException {
        return readFile(fileName, USER_FOLDER);
    }

    @GetMapping("/media/image/utilisateur/banniere/{image}")
    public ResponseEntity<FileSystemResource> getImageBanniere(@PathVariable("image") String fileName, HttpServletResponse response) throws IOException {
        return readFile(fileName, USER_FOLDER);
    }

    private ResponseEntity<FileSystemResource> readFile(String fileName, String baseFolder) throws IOException {
        File dir = new File(baseFolder);
        File file = new File(dir.getAbsolutePath() + File.separator + fileName);

        if (file.exists()) {
            FileSystemResource resource = new FileSystemResource(file);
            String mimeType = URLConnection.guessContentTypeFromName(file.getName());
            if (mimeType == null) {
                mimeType = "application/octet-stream";
            }

            HttpHeaders responseHeaders = new HttpHeaders();
            responseHeaders.setContentDisposition(ContentDisposition.parse("inline; filename=\"" + URLEncoder.encode(file.getName(), StandardCharsets.UTF_8) + "\""));
            responseHeaders.setContentType(MediaType.valueOf(mimeType));
            responseHeaders.setContentLength(resource.contentLength());

            return new ResponseEntity<>(resource,responseHeaders, HttpStatus.OK);
        }else{
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

}
