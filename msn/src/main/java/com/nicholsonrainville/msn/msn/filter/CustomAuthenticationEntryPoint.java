package com.nicholsonrainville.msn.msn.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nicholsonrainville.msn.msn.domain.HttpResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.Http403ForbiddenEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

import static com.nicholsonrainville.msn.msn.constant.ExceptionConstant.UNAUTHORIZED;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

@Component
public class CustomAuthenticationEntryPoint extends Http403ForbiddenEntryPoint {
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException{
        HttpStatus httpStatus = HttpStatus.FORBIDDEN;
        HttpResponse httpResponse = new HttpResponse(httpStatus.value(),
                httpStatus, httpStatus.getReasonPhrase(), UNAUTHORIZED);
        ObjectMapper objectMapper = new ObjectMapper();
        response.setStatus(HttpStatus.FORBIDDEN.value());
        response.setContentType(APPLICATION_JSON_VALUE);
        String responseBody = objectMapper.writeValueAsString(httpResponse);
        response.getWriter().write(responseBody);
    }
}
