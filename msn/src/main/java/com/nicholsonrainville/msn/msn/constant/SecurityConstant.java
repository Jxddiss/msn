package com.nicholsonrainville.msn.msn.constant;

public class SecurityConstant {
    public static final long EXPIRATION_TIME = 432_000_000;// 5 days date expiration (milliseconds)
    public static final String TOKEN_PREFIX = "Bearer ";
    public static final String JWT_TOKEN_HEADER = "Jwt-Token";
    public static final String TOKEN_CANNOT_BE_VERIFED = "Token cannot be verified";
    public static final String MSN = "MSN";
    public static final String MSN_USERS = "MSN users";
    public static final String AUTHORITIES = "authorities";
    public static final String ACCESS_DENIED_MESSAGE = "Vous n'avez pas l'authorisation d'accéder à cette page";
    public static final String OPTIONS_HTTP_METHOD = "OPTIONS";
    public static final String[] PUBLIC_URLS = {
            "/login",
            "/media/**",
            "/ws",
            "/inscription"
    };
    //public static final String[] PUBLIC_URLS = {"**"};
}
