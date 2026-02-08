package br.com.autoflex.domain.repository;

import br.com.autoflex.domain.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
}
