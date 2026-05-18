package com.ensolvers.notes.config;

import com.ensolvers.notes.models.Usuario;
import com.ensolvers.notes.repositories.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DatabaseSeeder {

    @Bean
    public CommandLineRunner initDatabase(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Apenas arranca el server, se fija si existe el admin. Si no existe, lo crea cifrado.
            if (usuarioRepository.findByUsername("admin").isEmpty()) {
                Usuario admin = new Usuario("admin", passwordEncoder.encode("admin123"));
                usuarioRepository.save(admin);
                System.out.println("✅ Usuario admin creado por defecto.");
            }
        };
    }
}