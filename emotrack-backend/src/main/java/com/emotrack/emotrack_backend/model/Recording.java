package com.emotrack.emotrack_backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "recordings")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Recording {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @Column(name = "file_path")
    private String filePath;

    @Column(name = "file_name")
    private String fileName;

    @Column(name = "duration_seconds")
    private Integer durationSeconds;

    @Column(name = "file_size_bytes")
    private Long fileSizeBytes;

    @Enumerated(EnumType.STRING)
    private Status status;

    @Column(name = "dominant_emotion")
    private String dominantEmotion;

    @Column(name = "intensity_percent")
    private Double intensityPercent;

    @Column(name = "recorded_at")
    private LocalDateTime recordedAt;

    @Column(name = "analyzed_at")
    private LocalDateTime analyzedAt;

    // Rezultatele per emoție
    @OneToMany(mappedBy = "recording", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<EmotionResult> emotionResults;

    @PrePersist
    protected void onCreate() {
        recordedAt = LocalDateTime.now();
        status = Status.PENDING;
    }

    public enum Status {
        PENDING, ANALYZING, ANALYZED, ERROR
    }
}