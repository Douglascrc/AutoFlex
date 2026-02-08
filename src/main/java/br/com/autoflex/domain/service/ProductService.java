package br.com.autoflex.domain.service;

import br.com.autoflex.domain.entity.Product;
import br.com.autoflex.domain.entity.ProductRawMaterial;
import br.com.autoflex.domain.entity.RawMaterial;
import br.com.autoflex.domain.repository.ProductRepository;
import br.com.autoflex.domain.repository.RawMaterialRepository;
import br.com.autoflex.domain.repository.ProductRawMaterialRepository;
import br.com.autoflex.dto.product.ProductRequest;
import br.com.autoflex.dto.product.ProductResponse;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {
    private final ProductRepository productRepository;
    private final RawMaterialRepository rawMaterialRepository;
    private final ProductRawMaterialRepository productRawMaterialRepository;

    public ProductService(ProductRepository productRepository,
                          RawMaterialRepository rawMaterialRepository,
                          ProductRawMaterialRepository productRawMaterialRepository) {
        this.productRepository = productRepository;
        this.rawMaterialRepository = rawMaterialRepository;
        this.productRawMaterialRepository = productRawMaterialRepository;
    }

    @Transactional
    public ProductResponse create(ProductRequest request) {
        Product product = new Product();
        product.setName(request.name());
        product.setDescription(request.description());
        product.setPrice(request.price());

        product = productRepository.save(product);
        return mapToResponse(product);
    }

    public List<ProductResponse> findAll() {
        return productRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ProductResponse findById(Long id) {
        return productRepository.findById(id)
                .map(this::mapToResponse)
                .orElse(null);
    }

    @Transactional
    public ProductResponse update(Long id, ProductRequest request) {
        return productRepository.findById(id)
                .map(product -> {
                    product.setName(request.name());
                    product.setDescription(request.description());
                    product.setPrice(request.price());
                    return mapToResponse(productRepository.save(product));
                })
                .orElse(null);
    }

    @Transactional
    public boolean delete(Long id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return true;
        }
        return false;
    }

    @Transactional
    public void addRawMaterialToProduct(Long productId, Long rawMaterialId, Double quantityNeeded) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));

        RawMaterial rawMaterial = rawMaterialRepository.findById(rawMaterialId)
                .orElseThrow(() -> new EntityNotFoundException("Raw Material not found"));

        ProductRawMaterial association = new ProductRawMaterial();
        association.setProduct(product);
        association.setRawMaterial(rawMaterial);
        association.setQuantity(quantityNeeded);

        productRawMaterialRepository.save(association);
    }


    public List<ProductResponse> findProductsProducibleWithInventory() {
        List<Product> allProducts = productRepository.findAll();

        return allProducts.stream()
                .filter(this::canBeProduced)
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private boolean canBeProduced(Product product) {
        List<ProductRawMaterial> requirements = productRawMaterialRepository.findByProduct(product);

        if (requirements.isEmpty()) {
            return false;
        }

        for (ProductRawMaterial req : requirements) {
            if (req.getRawMaterial().getCurrentStock() < req.getQuantity()) {
                return false;
            }
        }
        return true;
    }

    private ProductResponse mapToResponse(Product product) {
        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice()
        );
    }
}
