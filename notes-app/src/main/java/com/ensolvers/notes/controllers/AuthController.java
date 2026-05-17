package com.ensolvers.notes.controllers;

import com.ensolvers.notes.models.Usuario;
import com.ensolvers.notes.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") 
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Endpoint de registro (Por si React lo usa)
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Usuario usuario) {
        if (usuarioRepository.findByUsername(usuario.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "El usuario ya existe"));
        }
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        usuarioRepository.save(usuario);
        return ResponseEntity.ok(Map.of("success", true, "message", "Usuario registrado"));
    }

    // Endpoint de login (Adaptado a tu frontend pero conectado a Neon)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        // Buscamos en la base de datos de Neon
        Optional<Usuario> usuarioOpt = usuarioRepository.findByUsername(username);

        // Si existe y la contraseña tipeada coincide con la cifrada de la base...
        if (usuarioOpt.isPresent() && passwordEncoder.matches(password, usuarioOpt.get().getPassword())) {
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Login successful",
                "username", username
            ));
        }

        // Si le pifia a la clave o no existe
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
            "success", false,
            "message", "Invalid username or password"
        ));
    }
}