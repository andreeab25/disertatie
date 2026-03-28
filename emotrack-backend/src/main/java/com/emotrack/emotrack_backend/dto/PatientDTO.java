package com.emotrack.emotrack_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PatientDTO {
    private Long id;
    private String name;
    private String email;
    private Integer age;
    private String diagnosis;
    private String since;
    private String tempPassword;
    private Integer totalSessions;
    private String lastSession;
    private List<RecordingDTO> recordings;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecordingDTO {
        private Long id;
        private String date;
        private String duration;
        private String dominantEmotion;
        private Double intensity;
        private String status;
    }
}