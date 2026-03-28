package com.emotrack.emotrack_backend.repository;

import com.emotrack.emotrack_backend.model.Patient;
import com.emotrack.emotrack_backend.model.Recording;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecordingRepository extends JpaRepository<Recording, Long> {
    List<Recording> findByPatientOrderByRecordedAtDesc(Patient patient);
    List<Recording> findByPatientAndStatusOrderByRecordedAtDesc(
            Patient patient, Recording.Status status);
}