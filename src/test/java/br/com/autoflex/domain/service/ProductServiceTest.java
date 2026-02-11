package br.com.autoflex.domain.service;

import br.com.autoflex.domain.entity.Product;
import br.com.autoflex.domain.entity.ProductRawMaterial;
import br.com.autoflex.domain.entity.RawMaterial;
import br.com.autoflex.domain.repository.ProductRepository;
import br.com.autoflex.domain.repository.ProductRawMaterialRepository;
import br.com.autoflex.domain.repository.RawMaterialRepository;
import br.com.autoflex.dto.product.ProductRequest;
import br.com.autoflex.dto.product.ProductResponse;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private RawMaterialRepository rawMaterialRepository;

    @Mock
    private ProductRawMaterialRepository productRawMaterialRepository;

    @InjectMocks
    private ProductService productService;

    private Product testProduct;
    private RawMaterial testRawMaterial;
    private ProductRequest testProductRequest;

    @BeforeEach
    void setUp() {
        testProduct = new Product();
        testProduct.setId(1L);
        testProduct.setName("Chair");
        testProduct.setDescription("Wooden chair");
        testProduct.setPrice(new BigDecimal("100.00"));

        testRawMaterial = new RawMaterial();
        testRawMaterial.setId(1L);
        testRawMaterial.setName("Wood");
        testRawMaterial.setDescription("Oak wood");
        testRawMaterial.setCost(50.0);
        testRawMaterial.setCurrentStock(100.0);

        testProductRequest = new ProductRequest("Chair", "Wooden chair", new BigDecimal("100.00"));
    }

    @Test
    void shouldThrowEntityNotFoundExceptionWhenAddingRawMaterialToNonExistentProduct() {

        when(productRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> productService.addRawMaterialToProduct(999L, 1L, 5.0))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessage("Product not found");

        verify(productRepository).findById(999L);
        verify(rawMaterialRepository, never()).findById(anyLong());
        verify(productRawMaterialRepository, never()).save(any(ProductRawMaterial.class));
    }

    @Test
    void shouldThrowEntityNotFoundExceptionWhenAddingNonExistentRawMaterialToProduct() {

        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));
        when(rawMaterialRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> productService.addRawMaterialToProduct(1L, 999L, 5.0))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessage("Raw Material not found");

        verify(productRepository).findById(1L);
        verify(rawMaterialRepository).findById(999L);
        verify(productRawMaterialRepository, never()).save(any(ProductRawMaterial.class));
    }

    @Test
    void shouldReturnNullWhenFindingNonExistentProduct() {

        when(productRepository.findById(999L)).thenReturn(Optional.empty());

        ProductResponse result = productService.findById(999L);

        assertThat(result).isNull();
        verify(productRepository).findById(999L);
    }

    @Test
    void shouldReturnNullWhenUpdatingNonExistentProduct() {

        when(productRepository.findById(999L)).thenReturn(Optional.empty());

        ProductResponse result = productService.update(999L, testProductRequest);

        assertThat(result).isNull();
        verify(productRepository).findById(999L);
        verify(productRepository, never()).save(any(Product.class));
    }

    @Test
    void shouldReturnFalseWhenDeletingNonExistentProduct() {

        when(productRepository.existsById(999L)).thenReturn(false);


        boolean result = productService.delete(999L);


        assertThat(result).isFalse();
        verify(productRepository).existsById(999L);
        verify(productRepository, never()).deleteById(anyLong());
    }

    @Test
    void shouldNotIncludeProductsWithoutRawMaterialsInProducibleList() {

        Product productWithoutRawMaterials = new Product();
        productWithoutRawMaterials.setId(2L);
        productWithoutRawMaterials.setName("Simple Product");

        when(productRepository.findAll()).thenReturn(List.of(testProduct, productWithoutRawMaterials));
        when(productRawMaterialRepository.findByProduct(testProduct)).thenReturn(List.of(createProductRawMaterial()));
        when(productRawMaterialRepository.findByProduct(productWithoutRawMaterials)).thenReturn(Collections.emptyList());

        List<ProductResponse> result = productService.findProductsProducibleWithInventory();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).id()).isEqualTo(1L);
        assertThat(result.get(0).name()).isEqualTo("Chair");
        verify(productRepository).findAll();
        verify(productRawMaterialRepository).findByProduct(testProduct);
        verify(productRawMaterialRepository).findByProduct(productWithoutRawMaterials);
    }

    @Test
    void shouldNotIncludeProductsWithInsufficientRawMaterialStock() {

        ProductRawMaterial productRawMaterial = createProductRawMaterial();
        productRawMaterial.setQuantity(150.0); // More than available stock (100.0)

        when(productRepository.findAll()).thenReturn(List.of(testProduct));
        when(productRawMaterialRepository.findByProduct(testProduct)).thenReturn(List.of(productRawMaterial));

        List<ProductResponse> result = productService.findProductsProducibleWithInventory();

        assertThat(result).isEmpty();
        verify(productRepository).findAll();
        verify(productRawMaterialRepository).findByProduct(testProduct);
    }

    // =============================================
    // SUCCESS CASES
    // =============================================

    @Test
    void shouldCreateProductSuccessfully() {

        when(productRepository.save(any(Product.class))).thenReturn(testProduct);

        ProductResponse result = productService.create(testProductRequest);

        assertThat(result).isNotNull();
        assertThat(result.id()).isEqualTo(1L);
        assertThat(result.name()).isEqualTo("Chair");
        assertThat(result.description()).isEqualTo("Wooden chair");
        assertThat(result.price()).isEqualTo(new BigDecimal("100.00"));

        verify(productRepository).save(any(Product.class));
    }

    @Test
    void shouldFindAllProductsSuccessfully() {

        List<Product> products = List.of(testProduct);
        when(productRepository.findAll()).thenReturn(products);

        List<ProductResponse> result = productService.findAll();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).id()).isEqualTo(1L);
        assertThat(result.get(0).name()).isEqualTo("Chair");

        verify(productRepository).findAll();
    }

    @Test
    void shouldFindProductByIdSuccessfully() {

        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));

        ProductResponse result = productService.findById(1L);

        assertThat(result).isNotNull();
        assertThat(result.id()).isEqualTo(1L);
        assertThat(result.name()).isEqualTo("Chair");

        verify(productRepository).findById(1L);
    }

    @Test
    void shouldUpdateProductSuccessfully() {

        ProductRequest updateRequest = new ProductRequest("Updated Chair", "Updated description", new BigDecimal("150.00"));
        Product updatedProduct = new Product();
        updatedProduct.setId(1L);
        updatedProduct.setName("Updated Chair");
        updatedProduct.setDescription("Updated description");
        updatedProduct.setPrice(new BigDecimal("150.00"));

        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));
        when(productRepository.save(any(Product.class))).thenReturn(updatedProduct);

        ProductResponse result = productService.update(1L, updateRequest);

        assertThat(result).isNotNull();
        assertThat(result.id()).isEqualTo(1L);
        assertThat(result.name()).isEqualTo("Updated Chair");
        assertThat(result.description()).isEqualTo("Updated description");
        assertThat(result.price()).isEqualTo(new BigDecimal("150.00"));

        verify(productRepository).findById(1L);
        verify(productRepository).save(any(Product.class));
    }

    @Test
    void shouldDeleteProductSuccessfully() {

        when(productRepository.existsById(1L)).thenReturn(true);

        boolean result = productService.delete(1L);

        assertThat(result).isTrue();
        verify(productRepository).existsById(1L);
        verify(productRepository).deleteById(1L);
    }

    @Test
    void shouldAddRawMaterialToProductSuccessfully() {

        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));
        when(rawMaterialRepository.findById(1L)).thenReturn(Optional.of(testRawMaterial));

        productService.addRawMaterialToProduct(1L, 1L, 5.0);

        verify(productRepository).findById(1L);
        verify(rawMaterialRepository).findById(1L);
        verify(productRawMaterialRepository).save(any(ProductRawMaterial.class));
    }

    @Test
    void shouldFindProducibleProductsSuccessfully() {

        ProductRawMaterial productRawMaterial = createProductRawMaterial();
        productRawMaterial.setQuantity(50.0); // Less than available stock (100.0)

        when(productRepository.findAll()).thenReturn(List.of(testProduct));
        when(productRawMaterialRepository.findByProduct(testProduct)).thenReturn(List.of(productRawMaterial));

        List<ProductResponse> result = productService.findProductsProducibleWithInventory();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).id()).isEqualTo(1L);
        assertThat(result.get(0).name()).isEqualTo("Chair");

        verify(productRepository).findAll();
        verify(productRawMaterialRepository).findByProduct(testProduct);
    }

    @Test
    void shouldReturnEmptyListWhenNoProductsExist() {

        when(productRepository.findAll()).thenReturn(Collections.emptyList());

        List<ProductResponse> result = productService.findAll();

        assertThat(result).isEmpty();
        verify(productRepository).findAll();
    }

    @Test
    void shouldReturnEmptyListWhenNoProductsCanBeProduced() {

        when(productRepository.findAll()).thenReturn(Collections.emptyList());

        List<ProductResponse> result = productService.findProductsProducibleWithInventory();

        assertThat(result).isEmpty();
        verify(productRepository).findAll();
    }

    @Test
    void shouldHandleMultipleRawMaterialsForOneProduct() {

        RawMaterial rawMaterial2 = new RawMaterial();
        rawMaterial2.setId(2L);
        rawMaterial2.setName("Metal");
        rawMaterial2.setCurrentStock(200.0);

        ProductRawMaterial productRawMaterial1 = createProductRawMaterial();
        productRawMaterial1.setQuantity(50.0); // Available: 100.0

        ProductRawMaterial productRawMaterial2 = new ProductRawMaterial();
        productRawMaterial2.setProduct(testProduct);
        productRawMaterial2.setRawMaterial(rawMaterial2);
        productRawMaterial2.setQuantity(150.0); // Available: 200.0

        when(productRepository.findAll()).thenReturn(List.of(testProduct));
        when(productRawMaterialRepository.findByProduct(testProduct))
                .thenReturn(List.of(productRawMaterial1, productRawMaterial2));

        List<ProductResponse> result = productService.findProductsProducibleWithInventory();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).id()).isEqualTo(1L);

        verify(productRepository).findAll();
        verify(productRawMaterialRepository).findByProduct(testProduct);
    }

    private ProductRawMaterial createProductRawMaterial() {
        ProductRawMaterial productRawMaterial = new ProductRawMaterial();
        productRawMaterial.setProduct(testProduct);
        productRawMaterial.setRawMaterial(testRawMaterial);
        productRawMaterial.setQuantity(10.0);
        return productRawMaterial;
    }
}
