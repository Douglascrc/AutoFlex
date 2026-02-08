package br.com.autoflex.domain.repository;

import br.com.autoflex.domain.entity.RawMaterial;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RawMaterialRepository extends JpaRepository<RawMaterial, Long> {
}
