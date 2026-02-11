package br.com.autoflex.dto.validation;

import io.swagger.v3.oas.annotations.media.Schema;

public record ValidationError (
        @Schema(description = "Field that failed validation", example = "price")
        String field,
        @Schema(description = "Error message", example = "must be greater than 0")
        String message
) {}
