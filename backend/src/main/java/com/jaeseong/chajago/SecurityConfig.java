package com.jaeseong.chajago;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/**").permitAll()  // ⭐ 모든 경로 허용
                .anyRequest().permitAll()
            )
            .csrf(csrf -> csrf.disable())  // CSRF 비활성화
            .formLogin(form -> form.disable())  // 로그인 폼 비활성화
            .httpBasic(basic -> basic.disable());  // 기본 인증 비활성화

        return http.build();
    }
}