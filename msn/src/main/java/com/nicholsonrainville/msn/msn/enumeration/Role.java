package com.nicholsonrainville.msn.msn.enumeration;


import static com.nicholsonrainville.msn.msn.constant.Authority.*;

public enum Role {
    ROLE_USER(USERS_AUTHORITIES),
    ROLE_ADMIN(ADMIN_AUTHORITIES);

    private String[] authorities;

    Role(String... authorities) {
        this.authorities = authorities;
    }

    public String[] getAuthorities() {
        return authorities;
    }
}
