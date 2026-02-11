package br.com.autoflex.domain.service;

import br.com.autoflex.domain.entity.RawMaterial;
import br.com.autoflex.domain.repository.RawMaterialRepository;
import br.com.autoflex.dto.rawmaterial.RawMaterialRequest;
import br.com.autoflex.dto.rawmaterial.RawMaterialResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RawMaterialServiceTest {

    @Mock
    private RawMaterialRepository rawMaterialRepository;

    @InjectMocks
    private RawMaterialService rawMaterialService;

    private RawMaterial testRawMaterial;
    private RawMaterialRequest testRawMaterialRequest;

    @BeforeEach
    void setUp() {
        testRawMaterial = new RawMaterial();
        testRawMaterial.setId(1L);
        testRawMaterial.setName("Wood");
        testRawMaterial.setDescription("Oak wood");
        testRawMaterial.setCost(50.0);
        testRawMaterial.setCurrentStock(100.0);

        testRawMaterialRequest = new RawMaterialRequest("Wood", "Oak wood", 50.0, 100.0);
    }


    @Test
    void shouldReturnNullWhenFindingNonExistentRawMaterial() {

        when(rawMaterialRepository.findById(999L)).thenReturn(Optional.empty());

        RawMaterialResponse result = rawMaterialService.findById(999L);

        assertThat(result).isNull();
        verify(rawMaterialRepository).findById(999L);
    }

    @Test
    void shouldReturnNullWhenUpdatingNonExistentRawMaterial() {

        when(rawMaterialRepository.findById(999L)).thenReturn(Optional.empty());


        RawMaterialResponse result = rawMaterialService.update(999L, testRawMaterialRequest);


        assertThat(result).isNull();
        verify(rawMaterialRepository).findById(999L);
        verify(rawMaterialRepository, never()).save(any(RawMaterial.class));
    }

    @Test
    void shouldReturnFalseWhenDeletingNonExistentRawMaterial() {
        // Given
        when(rawMaterialRepository.existsById(999L)).thenReturn(false);


        boolean result = rawMaterialService.delete(999L);


        assertThat(result).isFalse();
        verify(rawMaterialRepository).existsById(999L);
        verify(rawMaterialRepository, never()).deleteById(anyLong());
    }

    @Test
    void shouldHandleRepositoryExceptionDuringCreate() {

        when(rawMaterialRepository.save(any(RawMaterial.class)))
                .thenThrow(new RuntimeException("Database connection failed"));

        assertThatThrownBy(() -> rawMaterialService.create(testRawMaterialRequest))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Database connection failed");

        verify(rawMaterialRepository).save(any(RawMaterial.class));
    }

    @Test
    void shouldHandleRepositoryExceptionDuringUpdate() {
        // Given
        when(rawMaterialRepository.findById(1L)).thenReturn(Optional.of(testRawMaterial));
        when(rawMaterialRepository.save(any(RawMaterial.class)))
                .thenThrow(new RuntimeException("Database connection failed"));

        assertThatThrownBy(() -> rawMaterialService.update(1L, testRawMaterialRequest))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Database connection failed");

        verify(rawMaterialRepository).findById(1L);
        verify(rawMaterialRepository).save(any(RawMaterial.class));
    }

    @Test
    void shouldHandleRepositoryExceptionDuringDelete() {
        // Given
        when(rawMaterialRepository.existsById(1L)).thenReturn(true);
        doThrow(new RuntimeException("Database connection failed"))
                .when(rawMaterialRepository).deleteById(1L);

        assertThatThrownBy(() -> rawMaterialService.delete(1L))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Database connection failed");

        verify(rawMaterialRepository).existsById(1L);
        verify(rawMaterialRepository).deleteById(1L);
    }

    // =============================================
    // SUCCESS CASES
    // =============================================

    @Test
    void shouldCreateRawMaterialSuccessfully() {

        when(rawMaterialRepository.save(any(RawMaterial.class))).thenReturn(testRawMaterial);


        RawMaterialResponse result = rawMaterialService.create(testRawMaterialRequest);

        assertThat(result).isNotNull();
        assertThat(result.id()).isEqualTo(1L);
        assertThat(result.name()).isEqualTo("Wood");
        assertThat(result.description()).isEqualTo("Oak wood");
        assertThat(result.cost()).isEqualTo(50.0);
        assertThat(result.currentStock()).isEqualTo(100.0);

        verify(rawMaterialRepository).save(any(RawMaterial.class));
    }

    @Test
    void shouldFindAllRawMaterialsSuccessfully() {

        List<RawMaterial> rawMaterials = List.of(testRawMaterial);
        when(rawMaterialRepository.findAll()).thenReturn(rawMaterials);


        List<RawMaterialResponse> result = rawMaterialService.findAll();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).id()).isEqualTo(1L);
        assertThat(result.get(0).name()).isEqualTo("Wood");

        verify(rawMaterialRepository).findAll();
    }

    @Test
    void shouldFindRawMaterialByIdSuccessfully() {

        when(rawMaterialRepository.findById(1L)).thenReturn(Optional.of(testRawMaterial));


        RawMaterialResponse result = rawMaterialService.findById(1L);

        assertThat(result).isNotNull();
        assertThat(result.id()).isEqualTo(1L);
        assertThat(result.name()).isEqualTo("Wood");
        assertThat(result.description()).isEqualTo("Oak wood");
        assertThat(result.cost()).isEqualTo(50.0);
        assertThat(result.currentStock()).isEqualTo(100.0);

        verify(rawMaterialRepository).findById(1L);
    }

    @Test
    void shouldUpdateRawMaterialSuccessfully() {

        RawMaterialRequest updateRequest = new RawMaterialRequest("Updated Wood", "Updated description", 60.0, 120.0);
        RawMaterial updatedRawMaterial = new RawMaterial();
        updatedRawMaterial.setId(1L);
        updatedRawMaterial.setName("Updated Wood");
        updatedRawMaterial.setDescription("Updated description");
        updatedRawMaterial.setCost(60.0);
        updatedRawMaterial.setCurrentStock(120.0);

        when(rawMaterialRepository.findById(1L)).thenReturn(Optional.of(testRawMaterial));
        when(rawMaterialRepository.save(any(RawMaterial.class))).thenReturn(updatedRawMaterial);


        RawMaterialResponse result = rawMaterialService.update(1L, updateRequest);

        assertThat(result).isNotNull();
        assertThat(result.id()).isEqualTo(1L);
        assertThat(result.name()).isEqualTo("Updated Wood");
        assertThat(result.description()).isEqualTo("Updated description");
        assertThat(result.cost()).isEqualTo(60.0);
        assertThat(result.currentStock()).isEqualTo(120.0);

        verify(rawMaterialRepository).findById(1L);
        verify(rawMaterialRepository).save(any(RawMaterial.class));
    }

    @Test
    void shouldDeleteRawMaterialSuccessfully() {

        when(rawMaterialRepository.existsById(1L)).thenReturn(true);


        boolean result = rawMaterialService.delete(1L);

        assertThat(result).isTrue();
        verify(rawMaterialRepository).existsById(1L);
        verify(rawMaterialRepository).deleteById(1L);
    }

    @Test
    void shouldReturnEmptyListWhenNoRawMaterialsExist() {

        when(rawMaterialRepository.findAll()).thenReturn(Collections.emptyList());


        List<RawMaterialResponse> result = rawMaterialService.findAll();

        assertThat(result).isEmpty();
        verify(rawMaterialRepository).findAll();
    }

    @Test
    void shouldCreateRawMaterialWithZeroCost() {

        RawMaterialRequest requestWithZeroCost = new RawMaterialRequest("Free Wood", "Free wood sample", 0.0, 100.0);
        RawMaterial rawMaterialWithZeroCost = new RawMaterial();
        rawMaterialWithZeroCost.setId(1L);
        rawMaterialWithZeroCost.setName("Free Wood");
        rawMaterialWithZeroCost.setDescription("Free wood sample");
        rawMaterialWithZeroCost.setCost(0.0);
        rawMaterialWithZeroCost.setCurrentStock(100.0);

        when(rawMaterialRepository.save(any(RawMaterial.class))).thenReturn(rawMaterialWithZeroCost);


        RawMaterialResponse result = rawMaterialService.create(requestWithZeroCost);

        assertThat(result).isNotNull();
        assertThat(result.cost()).isEqualTo(0.0);
        assertThat(result.name()).isEqualTo("Free Wood");

        verify(rawMaterialRepository).save(any(RawMaterial.class));
    }

    @Test
    void shouldCreateRawMaterialWithZeroStock() {

        RawMaterialRequest requestWithZeroStock = new RawMaterialRequest("Wood", "Out of stock wood", 50.0, 0.0);
        RawMaterial rawMaterialWithZeroStock = new RawMaterial();
        rawMaterialWithZeroStock.setId(1L);
        rawMaterialWithZeroStock.setName("Wood");
        rawMaterialWithZeroStock.setDescription("Out of stock wood");
        rawMaterialWithZeroStock.setCost(50.0);
        rawMaterialWithZeroStock.setCurrentStock(0.0);

        when(rawMaterialRepository.save(any(RawMaterial.class))).thenReturn(rawMaterialWithZeroStock);


        RawMaterialResponse result = rawMaterialService.create(requestWithZeroStock);


        assertThat(result).isNotNull();
        assertThat(result.currentStock()).isEqualTo(0.0);
        assertThat(result.name()).isEqualTo("Wood");

        verify(rawMaterialRepository).save(any(RawMaterial.class));
    }

    @Test
    void shouldUpdateRawMaterialStockOnly() {
        // Given - Update only stock, keep other fields the same
        RawMaterialRequest updateStockRequest = new RawMaterialRequest("Wood", "Oak wood", 50.0, 200.0);
        RawMaterial updatedRawMaterial = new RawMaterial();
        updatedRawMaterial.setId(1L);
        updatedRawMaterial.setName("Wood");
        updatedRawMaterial.setDescription("Oak wood");
        updatedRawMaterial.setCost(50.0);
        updatedRawMaterial.setCurrentStock(200.0);

        when(rawMaterialRepository.findById(1L)).thenReturn(Optional.of(testRawMaterial));
        when(rawMaterialRepository.save(any(RawMaterial.class))).thenReturn(updatedRawMaterial);

        RawMaterialResponse result = rawMaterialService.update(1L, updateStockRequest);

        assertThat(result).isNotNull();
        assertThat(result.currentStock()).isEqualTo(200.0);
        assertThat(result.name()).isEqualTo("Wood");
        assertThat(result.description()).isEqualTo("Oak wood");
        assertThat(result.cost()).isEqualTo(50.0);

        verify(rawMaterialRepository).findById(1L);
        verify(rawMaterialRepository).save(any(RawMaterial.class));
    }

    @Test
    void shouldHandleVeryLargeStockValues() {

        double largeStock = Double.MAX_VALUE;
        RawMaterialRequest requestWithLargeStock = new RawMaterialRequest("Wood", "Large stock wood", 50.0, largeStock);
        RawMaterial rawMaterialWithLargeStock = new RawMaterial();
        rawMaterialWithLargeStock.setId(1L);
        rawMaterialWithLargeStock.setName("Wood");
        rawMaterialWithLargeStock.setDescription("Large stock wood");
        rawMaterialWithLargeStock.setCost(50.0);
        rawMaterialWithLargeStock.setCurrentStock(largeStock);

        when(rawMaterialRepository.save(any(RawMaterial.class))).thenReturn(rawMaterialWithLargeStock);


        RawMaterialResponse result = rawMaterialService.create(requestWithLargeStock);

        assertThat(result).isNotNull();
        assertThat(result.currentStock()).isEqualTo(largeStock);

        verify(rawMaterialRepository).save(any(RawMaterial.class));
    }

    @Test
    void shouldHandleVeryLargeCostValues() {

        double largeCost = Double.MAX_VALUE;
        RawMaterialRequest requestWithLargeCost = new RawMaterialRequest("Gold", "Pure gold", largeCost, 100.0);
        RawMaterial rawMaterialWithLargeCost = new RawMaterial();
        rawMaterialWithLargeCost.setId(1L);
        rawMaterialWithLargeCost.setName("Gold");
        rawMaterialWithLargeCost.setDescription("Pure gold");
        rawMaterialWithLargeCost.setCost(largeCost);
        rawMaterialWithLargeCost.setCurrentStock(100.0);

        when(rawMaterialRepository.save(any(RawMaterial.class))).thenReturn(rawMaterialWithLargeCost);


        RawMaterialResponse result = rawMaterialService.create(requestWithLargeCost);

        assertThat(result).isNotNull();
        assertThat(result.cost()).isEqualTo(largeCost);

        verify(rawMaterialRepository).save(any(RawMaterial.class));
    }
}
