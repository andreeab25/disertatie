package com.emotrack.emotrack_backend.service;

import com.emotrack.emotrack_backend.dto.PatientDTO;
import com.emotrack.emotrack_backend.model.Patient;
import com.emotrack.emotrack_backend.model.Recording;
import com.emotrack.emotrack_backend.model.User;
import com.emotrack.emotrack_backend.repository.PatientRepository;
import com.emotrack.emotrack_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository patientRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User negăsit"));
    }

    public List<PatientDTO> getMyPatients() {
        User psychologist = getCurrentUser();
        return patientRepository.findByPsychologist(psychologist)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public PatientDTO getPatientById(Long id) {
        User psychologist = getCurrentUser();
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pacient negăsit"));

        if (!patient.getPsychologist().getId().equals(psychologist.getId())) {
            throw new RuntimeException("Acces interzis");
        }
        return toDTO(patient);
    }

    public PatientDTO addPatient(String name, String email,
                                 Integer age, String diagnosis) {
        User psychologist = getCurrentUser();

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email-ul există deja");
        }

        // Generează parolă temporară random
        String tempPassword = generateTempPassword();

        User patientUser = User.builder()
                .name(name)
                .email(email)
                .password(passwordEncoder.encode(tempPassword))
                .role(User.Role.PATIENT)
                .mustChangePassword(true)
                .build();
        userRepository.save(patientUser);

        Patient patient = Patient.builder()
                .user(patientUser)
                .psychologist(psychologist)
                .age(age)
                .diagnosis(diagnosis)
                .sinceDate(LocalDate.now())
                .build();

        PatientDTO dto = toDTO(patientRepository.save(patient));
        dto.setTempPassword(tempPassword);
        return dto;
    }

    private String generateTempPassword() {
        String chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
        StringBuilder sb = new StringBuilder();
        java.util.Random random = new java.util.Random();
        for (int i = 0; i < 10; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }

    private PatientDTO toDTO(Patient p) {
        List<Recording> recordings = p.getRecordings();

        String lastSession = recordings != null && !recordings.isEmpty()
                ? recordings.get(0).getRecordedAt().toLocalDate().toString()
                : "—";

        List<PatientDTO.RecordingDTO> recordingDTOs = recordings != null
                ? recordings.stream().map(r -> PatientDTO.RecordingDTO.builder()
                        .id(r.getId())
                        .date(r.getRecordedAt().toLocalDate().toString())
                        .duration(r.getDurationSeconds() != null
                                ? r.getDurationSeconds() / 60 + " min" : "—")
                        .dominantEmotion(r.getDominantEmotion() != null
                                ? r.getDominantEmotion() : "—")
                        .intensity(r.getIntensityPercent())
                        .status(r.getStatus().name())
                        .build())
                .collect(Collectors.toList())
                : List.of();

        return PatientDTO.builder()
                .id(p.getId())
                .name(p.getUser().getName())
                .email(p.getUser().getEmail())
                .age(p.getAge())
                .diagnosis(p.getDiagnosis() != null ? p.getDiagnosis() : "—")
                .since(p.getSinceDate() != null ? p.getSinceDate().toString() : "—")
                .totalSessions(recordings != null ? recordings.size() : 0)
                .lastSession(lastSession)
                .recordings(recordingDTOs)
                .build();
    }
}