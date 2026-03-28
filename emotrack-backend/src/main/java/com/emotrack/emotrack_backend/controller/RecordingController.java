package com.emotrack.emotrack_backend.controller;

import com.emotrack.emotrack_backend.model.Recording;
import com.emotrack.emotrack_backend.repository.RecordingRepository;
import com.emotrack.emotrack_backend.service.RecordingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/recordings")
@RequiredArgsConstructor
public class RecordingController {

    private final RecordingService recordingService;
    private final RecordingRepository recordingRepository;

    // GET /api/recordings — lista înregistrărilor mele
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getMyRecordings() {
        List<Recording> recordings = recordingService.getMyRecordings();
        return ResponseEntity.ok(recordings.stream().map(this::toMap).collect(Collectors.toList()));
    }

    // GET /api/recordings/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getRecording(@PathVariable Long id) {
        return ResponseEntity.ok(toMap(recordingService.getRecordingById(id)));
    }

    // POST /api/recordings/upload — upload fișier audio
    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> upload(
            @RequestParam("file") MultipartFile file) {
        try {
            Recording recording = recordingService.uploadRecording(file);
            return ResponseEntity.ok(toMap(recording));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    @GetMapping("/{id}/stream")
    public ResponseEntity<org.springframework.core.io.Resource> streamAudio(
            @PathVariable Long id) {
        try {
            Recording recording = recordingRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Negăsit"));

            java.io.File file = new java.io.File(recording.getFilePath());
            if (!file.exists()) {
                return ResponseEntity.notFound().build();
            }

            org.springframework.core.io.Resource resource =
                    new org.springframework.core.io.FileSystemResource(file);

            return ResponseEntity.ok()
                    .header("Content-Type", "audio/mp4")
                    .header("Content-Disposition", "inline; filename=\"" + recording.getFileName() + "\"")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // GET /api/recordings/patient/{patientId} — pentru psiholog
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Map<String, Object>>> getPatientRecordings(
            @PathVariable Long patientId) {
        try {
            List<Recording> recordings = recordingService.getRecordingsByPatientId(patientId);
            return ResponseEntity.ok(recordings.stream().map(this::toMap).collect(Collectors.toList()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(List.of(Map.of("error", e.getMessage())));
        }
    }

    // Helper — convertește Recording la Map
    private Map<String, Object> toMap(Recording r) {
        return Map.of(
                "id", r.getId(),
                "fileName", r.getFileName() != null ? r.getFileName() : "—",
                "date", r.getRecordedAt().toLocalDate().toString(),
                "duration", r.getDurationSeconds() != null
                        ? r.getDurationSeconds() / 60 + " min" : "—",
                "size", r.getFileSizeBytes() != null
                        ? String.format("%.1f MB", r.getFileSizeBytes() / 1024.0 / 1024.0) : "—",
                "dominantEmotion", r.getDominantEmotion() != null ? r.getDominantEmotion() : "—",
                "intensity", r.getIntensityPercent() != null ? r.getIntensityPercent() : 0.0,
                "status", r.getStatus().name()
        );
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleError(RuntimeException ex) {
        return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
    }
}