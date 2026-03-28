package com.emotrack.emotrack_backend.controller;

import com.emotrack.emotrack_backend.dto.PatientDTO;
import com.emotrack.emotrack_backend.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;
    private final PasswordEncoder passwordEncoder;

    // GET /api/patients
    @GetMapping
    public ResponseEntity<List<PatientDTO>> getMyPatients() {
        return ResponseEntity.ok(patientService.getMyPatients());
    }

    // GET /api/patients/{id}
    @GetMapping("/{id}")
    public ResponseEntity<PatientDTO> getPatient(@PathVariable Long id) {
        return ResponseEntity.ok(patientService.getPatientById(id));
    }

    @PostMapping
    public ResponseEntity<PatientDTO> addPatient(@RequestBody Map<String, Object> body) {
        String name      = body.get("name").toString();
        String email     = body.get("email").toString();
        Integer age      = Integer.valueOf(body.get("age").toString());
        String diagnosis = body.getOrDefault("diagnosis", "").toString();

        return ResponseEntity.ok(
                patientService.addPatient(name, email, age, diagnosis)
        );
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleError(RuntimeException ex) {
        return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
    }
}