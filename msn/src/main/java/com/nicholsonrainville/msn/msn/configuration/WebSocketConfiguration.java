package com.nicholsonrainville.msn.msn.configuration;

import com.nicholsonrainville.msn.msn.utils.JWTTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessageHeaders;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.util.MultiValueMap;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import java.util.List;
import java.util.Map;

import static com.nicholsonrainville.msn.msn.constant.SecurityConstant.TOKEN_PREFIX;
import static org.springframework.http.HttpHeaders.AUTHORIZATION;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfiguration implements WebSocketMessageBrokerConfigurer {
    public static final int CORE_POOL_SIZE = 4;
    public static final int MAX_POOL_SIZE = 4;
    public final JWTTokenProvider jwtTokenProvider;

    @Autowired
    public WebSocketConfiguration(JWTTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry
            .addEndpoint("/ws")
            .setAllowedOrigins("*")
            .withSockJS();
        registry
            .addEndpoint("/ws")
            .setAllowedOrigins("*");
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry
            .setApplicationDestinationPrefixes("/app")
            .enableSimpleBroker("/topic");
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        WebSocketMessageBrokerConfigurer.super.configureClientInboundChannel(registration);
        registration.taskExecutor().corePoolSize(CORE_POOL_SIZE);
        registration.taskExecutor().maxPoolSize(MAX_POOL_SIZE);
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor =
                        MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
                if (StompCommand.CONNECT.equals(accessor.getCommand())) {
                    String token = accessor.getFirstNativeHeader(AUTHORIZATION);
                    if (token != null && token.startsWith(TOKEN_PREFIX)) {
                        token = token.substring(TOKEN_PREFIX.length());
                        String username = jwtTokenProvider.getSubject(token);
                        if (jwtTokenProvider.isTokenValid(username, token)) {
                            List<GrantedAuthority> authorities = jwtTokenProvider.getAuthorities(token);
                            UsernamePasswordAuthenticationToken userPasswordautToken = new
                                    UsernamePasswordAuthenticationToken(username,null,authorities);
                            accessor.setUser(userPasswordautToken);
                        }
                    }
                }
                return message;
            }
        });
    }
}
