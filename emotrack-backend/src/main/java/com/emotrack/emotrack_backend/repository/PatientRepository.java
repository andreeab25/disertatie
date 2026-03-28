package com.emotrack.emotrack_backend.repository;

import com.emotrack.emotrack_backend.model.Patient;
import com.emotrack.emotrack_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    List<Patient> findByPsychologist(User psychologist);
    Optional<Patient> findByUser(User user);
}