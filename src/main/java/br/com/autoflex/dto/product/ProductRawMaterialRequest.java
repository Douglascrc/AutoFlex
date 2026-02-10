package br.com.autoflex.dto.product;

import io.swagger.v3.oas.annotations.media.Schema;

public record ProductRawMaterialRequest(
    @Schema(description = "ID of the raw material to add", example = "5")
    Long rawMaterialId,
    @Schema(description = "Quantity of raw material required", example = "2.5")
    Double quantity
) {}

