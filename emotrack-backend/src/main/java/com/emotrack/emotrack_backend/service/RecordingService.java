package com.emotrack.emotrack_backend.service;

import com.emotrack.emotrack_backend.model.Patient;
import com.emotrack.emotrack_backend.model.Recording;
import com.emotrack.emotrack_backend.model.User;
import com.emotrack.emotrack_backend.repository.PatientRepository;
import com.emotrack.emotrack_backend.repository.RecordingRepository;
import com.emotrack.emotrack_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RecordingService {

    private final RecordingRepository recordingRepository;
    private final PatientRepository patientRepository;
    private final UserRepository userRepository;

    @Value("${app.upload.dir}")
    private String uploadDir;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User negăsit"));
    }

    private Patient getCurrentPatient() {
        User user = getCurrentUser();
        return patientRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Profil pacient negăsit"));
    }

    // Upload înregistrare nouă
    public Recording uploadRecording(MultipartFile file) throws IOException {
        Patient patient = getCurrentPatient();

        // Creează folderul dacă nu există
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Salvează fișierul cu nume unic
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Salvează în DB
        Recording recording = Recording.builder()
                .patient(patient)
                .fileName(file.getOriginalFilename())
                .filePath(filePath.toString())
                .fileSizeBytes(file.getSize())
                .status(Recording.Status.PENDING)
                .build();

        return recordingRepository.save(recording);
    }

    // Lista înregistrărilor pacientului curent
    public List<Recording> getMyRecordings() {
        Patient patient = getCurrentPatient();
        return recordingRepository.findByPatientOrderByRecordedAtDesc(patient);
    }

    // O înregistrare după ID
    public Recording getRecordingById(Long id) {
        Patient patient = getCurrentPatient();
        Recording recording = recordingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Înregistrare negăsită"));

        if (!recording.getPatient().getId().equals(patient.getId())) {
            throw new RuntimeException("Acces interzis");
        }
        return recording;
    }
    public List<Recording> getRecordingsByPatientId(Long patientId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Pacient negăsit"));

        User psychologist = getCurrentUser();
        if (!patient.getPsychologist().getId().equals(psychologist.getId())) {
            throw new RuntimeException("Acces interzis");
        }

        return recordingRepository.findByPatientOrderByRecordedAtDesc(patient);
    }

    public Recording saveAnalysisResult(Long id, String dominantEmotion,
                                        Double intensity) {
        Recording recording = recordingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Înregistrare negăsită"));

        recording.setDominantEmotion(dominantEmotion);
        recording.setIntensityPercent(intensity);
        recording.setStatus(Recording.Status.ANALYZED);
        recording.setAnalyzedAt(java.time.LocalDateTime.now());

        return recordingRepository.save(recording);
    }
}