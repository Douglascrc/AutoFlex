package br.com.autoflex.domain.service;

import br.com.autoflex.domain.entity.RawMaterial;
import br.com.autoflex.domain.repository.RawMaterialRepository;
import br.com.autoflex.dto.rawmaterial.RawMaterialRequest;
import br.com.autoflex.dto.rawmaterial.RawMaterialResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RawMaterialService {

    private final RawMaterialRepository rawMaterialRepository;

    public RawMaterialService(RawMaterialRepository rawMaterialRepository) {
        this.rawMaterialRepository = rawMaterialRepository;
    }

    @Transactional
    public RawMaterialResponse create(RawMaterialRequest request) {
        return rawMaterialRepository.findByName(request.name())
                .map(existingMaterial -> {

                    existingMaterial.setCurrentStock(existingMaterial.getCurrentStock() + request.currentStock());
                    existingMaterial.setCost(request.cost());
                    existingMaterial.setDescription(request.description());
                    return mapToResponse(rawMaterialRepository.save(existingMaterial));
                })
                .orElseGet(() -> {

                    RawMaterial newMaterial = new RawMaterial();
                    newMaterial.setName(request.name());
                    newMaterial.setDescription(request.description());
                    newMaterial.setCost(request.cost());
                    newMaterial.setCurrentStock(request.currentStock());
                    return mapToResponse(rawMaterialRepository.save(newMaterial));
                });
    }

    public List<RawMaterialResponse> findAll() {
        return rawMaterialRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    public RawMaterialResponse findById(Long id) {
        return rawMaterialRepository.findById(id)
                .map(this::mapToResponse)
                .orElse(null);
    }

    @Transactional
    public RawMaterialResponse update(Long id, RawMaterialRequest request) {
        return rawMaterialRepository.findById(id)
                .map(rawMaterial -> {
                    rawMaterial.setName(request.name());
                    rawMaterial.setDescription(request.description());
                    rawMaterial.setCost(request.cost());
                    rawMaterial.setCurrentStock(request.currentStock());
                    return mapToResponse(rawMaterialRepository.save(rawMaterial));
                })
                .orElse(null);
    }

    @Transactional
    public boolean delete(Long id) {
        if (rawMaterialRepository.existsById(id)) {
            rawMaterialRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private RawMaterialResponse mapToResponse(RawMaterial rawMaterial) {
        return new RawMaterialResponse(
                rawMaterial.getId(),
                rawMaterial.getName(),
                rawMaterial.getDescription(),
                rawMaterial.getCost(),
                rawMaterial.getCurrentStock()
        );
    }
}

