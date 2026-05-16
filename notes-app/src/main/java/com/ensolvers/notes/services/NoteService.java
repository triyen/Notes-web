package com.ensolvers.notes.services;

import com.ensolvers.notes.models.Note;
import com.ensolvers.notes.models.Category; // <-- Agregamos el modelo Category
import com.ensolvers.notes.repositories.NoteRepository;
import com.ensolvers.notes.repositories.CategoryRepository; // <-- Agregamos el repositorio de Categorías
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class NoteService {

    private final NoteRepository noteRepository;
    private final CategoryRepository categoryRepository; // <-- Declaramos el nuevo repositorio

    // Actualizamos el constructor para que Spring inyecte ambos repositorios juntos
    public NoteService(NoteRepository noteRepository, CategoryRepository categoryRepository) {
        this.noteRepository = noteRepository;
        this.categoryRepository = categoryRepository;
    }

    public Note updateNote(Long id, Note details) {
        // 1. Buscamos la nota original
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("No encontré la nota"));

        // 2. Le pisamos los datos simples
        note.setTitle(details.getTitle());
        note.setContent(details.getContent());

        // 3. ¡LA SOLUCIÓN! Buscamos las categorías reales en la DB para que Hibernate no se tilde
        Set<Category> managedCategories = new HashSet<>();
        if (details.getCategories() != null) {
            for (Category cat : details.getCategories()) {
                categoryRepository.findById(cat.getId()).ifPresent(managedCategories::add);
            }
        }
        note.setCategories(managedCategories);

        // 4. Guardamos los cambios con la relación bien armada
        return noteRepository.save(note);
    }

    public List<Note> getActiveNotes() {
        return noteRepository.findByArchived(false);
    }

    public List<Note> getArchivedNotes() {
        return noteRepository.findByArchived(true);
    }

    public Note saveNote(Note note) {
        return noteRepository.save(note);
    }

    public void deleteNote(Long id) {
        noteRepository.deleteById(id);
    }

    public Note toggleArchive(Long id) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nota no encontrada"));
        note.setArchived(!note.isArchived());
        return noteRepository.save(note);
    }

    public List<Note> getNotesByCategory(Long categoryId) {
        return noteRepository.findByCategoriesId(categoryId);
    }
}