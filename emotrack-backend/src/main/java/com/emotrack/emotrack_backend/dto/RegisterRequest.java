package com.emotrack.emotrack_backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank
    private String name;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    @Size(min = 6, message = "Parola trebuie să aibă minim 6 caractere")
    private String password;

    @NotBlank
    private String role;
}