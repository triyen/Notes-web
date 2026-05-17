package com.ensolvers.notes.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // 1. Configuramos el motor que va a cifrar las contraseñas
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // 2. Configuramos los permisos de las rutas
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Desactivamos esto porque usamos React separado
            .authorizeHttpRequests(auth -> auth
                // Acá le decimos qué rutas son públicas (para loguearse y registrarse)
                .requestMatchers("/api/auth/**").permitAll() 
                // Todo el resto de la aplicación (como ver o borrar notas) va a pedir estar logueado
                .anyRequest().authenticated()
            )
            .httpBasic(basic -> basic.disable()); // Desactivamos el cartel feo por defecto de Spring

        return http.build();
    }
}