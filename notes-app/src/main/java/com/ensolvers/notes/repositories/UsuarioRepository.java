package com.ensolvers.notes.repositories;

import com.ensolvers.notes.models.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    // Este método es oro puro: Spring hace la consulta de SQL solo para buscar el usuario por su nombre
    Optional<Usuario> findByUsername(String username);
}