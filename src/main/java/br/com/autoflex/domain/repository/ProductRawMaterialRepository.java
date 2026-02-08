package br.com.autoflex.domain.repository;

import br.com.autoflex.domain.entity.Product;
import br.com.autoflex.domain.entity.ProductRawMaterial;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRawMaterialRepository extends JpaRepository<ProductRawMaterial, Long> {
    List<ProductRawMaterial> findByProduct(Product product);
}
