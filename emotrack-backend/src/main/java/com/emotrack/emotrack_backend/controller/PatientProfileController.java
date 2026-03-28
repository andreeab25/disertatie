package com.emotrack.emotrack_backend.controller;

import com.emotrack.emotrack_backend.dto.PatientDTO;
import com.emotrack.emotrack_backend.model.Patient;
import com.emotrack.emotrack_backend.model.User;
import com.emotrack.emotrack_backend.repository.PatientRepository;
import com.emotrack.emotrack_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/me")
@RequiredArgsConstructor
public class PatientProfileController {

    private final UserRepository userRepository;
    private final PatientRepository patientRepository;

    // GET /api/me/profile — datele pacientului curent
    @GetMapping("/profile")
    public ResponseEntity<?> getMyProfile() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User negăsit"));

        // Dacă e psiholog returnează info de bază
        if (user.getRole() == User.Role.PSYCHOLOGIST) {
            return ResponseEntity.ok(Map.of(
                    "id", user.getId(),
                    "name", user.getName(),
                    "email", user.getEmail(),
                    "role", user.getRole().name()
            ));
        }

        // Dacă e pacient returnează profilul complet
        Patient patient = patientRepository.findByUser(user)
                .orElse(null);

        if (patient == null) {
            return ResponseEntity.ok(Map.of(
                    "id", user.getId(),
                    "name", user.getName(),
                    "email", user.getEmail(),
                    "role", user.getRole().name(),
                    "hasProfile", false
            ));
        }

        return ResponseEntity.ok(Map.of(
                "id", patient.getId(),
                "name", user.getName(),
                "email", user.getEmail(),
                "role", user.getRole().name(),
                "age", patient.getAge(),
                "diagnosis", patient.getDiagnosis() != null ? patient.getDiagnosis() : "—",
                "since", patient.getSinceDate() != null ? patient.getSinceDate().toString() : "—",
                "totalSessions", patient.getRecordings() != null ? patient.getRecordings().size() : 0,
                "hasProfile", true
        ));
    }
}