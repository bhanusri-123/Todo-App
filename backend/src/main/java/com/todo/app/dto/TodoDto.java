package com.todo.app.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;


public class TodoDto {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateRequest {
        @NotBlank(message = "Title is mandatory")
        @Size(min = 1, max = 255, message = "Title must be between 1 and 255 characters")
        private String title;

        private String description;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateRequest {
        @Size(min = 1, max = 255, message = "Title must be between 1 and 255 characters")
        private String title;

        private String description;

        private Boolean completed;
    }


    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private Long id;
        private String title;
        private String description;
        private Boolean completed;
        private LocalDateTime createdAt;
    }
}
