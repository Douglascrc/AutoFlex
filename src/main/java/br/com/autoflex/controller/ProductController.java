package br.com.autoflex.controller;

import br.com.autoflex.domain.service.ProductService;
import br.com.autoflex.dto.product.ProductRequest;
import br.com.autoflex.dto.product.ProductResponse;
import br.com.autoflex.dto.product.ProductRawMaterialRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
@Validated
@Tag(name = "Product", description = "Operations related to products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping
    @Operation(summary = "Create a new product", description = "Creates a new product with the provided details.")
    @ApiResponse(responseCode = "201", description = "Product created successfully")
    public ResponseEntity<ProductResponse> createProduct(@RequestBody ProductRequest request) {
        ProductResponse created = productService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    @Operation(summary = "List all products", description = "Retrieves a list of all registered products.")
    @ApiResponse(responseCode = "200", description = "List of products retrieved successfully")
    public ResponseEntity<List<ProductResponse>> listProducts() {
        List<ProductResponse> products = productService.findAll();
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a product by ID", description = "Retrieves details of a product by its ID.")
    @ApiResponse(responseCode = "200", description = "Product found")
    @ApiResponse(responseCode = "404", description = "Product not found")
    public ResponseEntity<ProductResponse> getProduct(@PathVariable Long id) {
        ProductResponse product = productService.findById(id);
        if (product == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(product);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a product", description = "Updates the details of an existing product.")
    @ApiResponse(responseCode = "200", description = "Product updated successfully")
    @ApiResponse(responseCode = "404", description = "Product not found")
    public ResponseEntity<ProductResponse> updateProduct(@PathVariable Long id,
                                                        @RequestBody ProductRequest request) {
        ProductResponse updated = productService.update(id, request);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a product", description = "Removes a product from the system.")
    @ApiResponse(responseCode = "204", description = "Product deleted successfully")
    @ApiResponse(responseCode = "404", description = "Product not found")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        boolean deleted = productService.delete(id);
        if (!deleted) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/raw-materials")
    @Operation(summary = "Add raw material to product", description = "Associates a raw material with a product specifying the quantity.")
    @ApiResponse(responseCode = "200", description = "Raw material added to product successfully")
    @ApiResponse(responseCode = "404", description = "Product or Raw Material not found")
    public ResponseEntity<Void> addRawMaterial(@PathVariable Long id,
                                               @RequestBody ProductRawMaterialRequest request) {
        productService.addRawMaterialToProduct(id, request.rawMaterialId(), request.quantity());
        return ResponseEntity.ok().build();
    }
}
