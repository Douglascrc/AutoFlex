package br.com.autoflex.controller;

import br.com.autoflex.domain.service.RawMaterialService;
import br.com.autoflex.dto.rawmaterial.RawMaterialRequest;
import br.com.autoflex.dto.rawmaterial.RawMaterialResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/raw-materials")
@Validated
@Tag(name = "Raw Material", description = "Operations related to raw materials")
public class RawMaterialController {

    private final RawMaterialService rawMaterialService;

    public RawMaterialController(RawMaterialService rawMaterialService) {
        this.rawMaterialService = rawMaterialService;
    }

    @PostMapping
    @Operation(summary = "Create a new raw material", description = "Creates a new raw material or updates existing stock.")
    @ApiResponse(responseCode = "201", description = "Raw material created or updated successfully")
    public ResponseEntity<RawMaterialResponse> createRawMaterial(@RequestBody RawMaterialRequest request) {
        RawMaterialResponse created = rawMaterialService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    @Operation(summary = "List all raw materials", description = "Retrieves a list of all registered raw materials.")
    @ApiResponse(responseCode = "200", description = "List of raw materials retrieved successfully")
    public ResponseEntity<List<RawMaterialResponse>> listRawMaterials() {
        List<RawMaterialResponse> rawMaterials = rawMaterialService.findAll();
        return ResponseEntity.ok(rawMaterials);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a raw material by ID", description = "Retrieves details of a raw material by its ID.")
    @ApiResponse(responseCode = "200", description = "Raw material found")
    @ApiResponse(responseCode = "404", description = "Raw material not found")
    public ResponseEntity<RawMaterialResponse> getRawMaterial(@PathVariable Long id) {
        RawMaterialResponse rawMaterial = rawMaterialService.findById(id);
        if (rawMaterial == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(rawMaterial);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a raw material", description = "Updates the details of an existing raw material.")
    @ApiResponse(responseCode = "200", description = "Raw material updated successfully")
    @ApiResponse(responseCode = "404", description = "Raw material not found")
    public ResponseEntity<RawMaterialResponse> updateRawMaterial(@PathVariable Long id,
                                                                 @RequestBody RawMaterialRequest request) {
        RawMaterialResponse updated = rawMaterialService.update(id, request);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a raw material", description = "Removes a raw material from the system.")
    @ApiResponse(responseCode = "204", description = "Raw material deleted successfully")
    @ApiResponse(responseCode = "404", description = "Raw material not found")
    public ResponseEntity<Void> deleteRawMaterial(@PathVariable Long id) {
        boolean deleted = rawMaterialService.delete(id);
        if (!deleted) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }
}
