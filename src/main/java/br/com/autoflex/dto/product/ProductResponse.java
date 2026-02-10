package br.com.autoflex.dto.product;

import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;

public record ProductResponse(
        @Schema(description = "Unique identifier of the product", example = "1")
        Long id,
        @Schema(description = "Name of the product", example = "Chair")
        String name,
        @Schema(description = "Description of the product", example = "A comfortable wooden chair")
        String description,
        @Schema(description = "Price of the product", example = "150.00")
        BigDecimal price) {
}
