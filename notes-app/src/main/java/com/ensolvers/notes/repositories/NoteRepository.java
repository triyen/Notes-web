package com.ensolvers.notes.repositories;

import com.ensolvers.notes.models.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NoteRepository extends JpaRepository<Note, Long> {
   
    List<Note> findByArchived(boolean archived);
    List<Note> findByCategoriesId(Long categoryId);
}