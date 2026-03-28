package com.emotrack.emotrack_backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "patients")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Legătura 1:1 cu contul de user al pacientului
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Psihologul care se ocupă de pacient
    @ManyToOne
    @JoinColumn(name = "psychologist_id")
    private User psychologist;

    @Column(nullable = false)
    private Integer age;

    private String diagnosis;

    @Column(name = "since_date")
    private LocalDate sinceDate;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Recording> recordings;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}