package com.emotrack.emotrack_backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "emotion_results")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmotionResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "recording_id", nullable = false)
    private Recording recording;

    @Column(nullable = false)
    private String emotion;  // Fericire, Tristețe, Furie, Surpriză, Neutru

    @Column(name = "probability_percent", nullable = false)
    private Double probabilityPercent;
}