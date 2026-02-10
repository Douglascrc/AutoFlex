package br.com.autoflex.dto.rawmaterial;

import io.swagger.v3.oas.annotations.media.Schema;

public record RawMaterialResponse(
    @Schema(description = "Unique identifier of the raw material", example = "1")
    Long id,
    @Schema(description = "Name of the raw material", example = "Wood")
    String name,
    @Schema(description = "Description of the raw material", example = "Oak wood plank")
    String description,
    @Schema(description = "Cost per unit", example = "50.0")
    Double cost,
    @Schema(description = "Current stock quantity", example = "100.0")
    Double currentStock
) {}

