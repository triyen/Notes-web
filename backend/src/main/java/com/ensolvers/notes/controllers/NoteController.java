package com.ensolvers.notes.controllers;

import com.ensolvers.notes.models.Note;
import com.ensolvers.notes.services.NoteService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin(origins = "*") // Importante para que React no te rebote el pedido
public class NoteController {

    private final NoteService noteService;

    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }

    @GetMapping
    public List<Note> getActiveNotes() {
        return noteService.getActiveNotes();
    }

    @GetMapping("/archived")
    public List<Note> getArchivedNotes() {
        return noteService.getArchivedNotes();
    }

    @PostMapping
    public Note createNote(@RequestBody Note note) {
        return noteService.saveNote(note);
    }

    @PutMapping("/{id}")
    public Note updateNote(@PathVariable Long id, @RequestBody Note note) {
        return noteService.updateNote(id, note);
    }

    @DeleteMapping("/{id}")
    public void deleteNote(@PathVariable Long id) {
        noteService.deleteNote(id);
    }

    @PatchMapping("/{id}/archive")
    public Note archiveNote(@PathVariable Long id) {
        return noteService.toggleArchive(id);
    }

    @GetMapping("/category/{categoryId}")
public List<Note> getNotesByCategory(@PathVariable Long categoryId) {
    return noteService.getNotesByCategory(categoryId); // <-- Ahora usamos noteService
}
}