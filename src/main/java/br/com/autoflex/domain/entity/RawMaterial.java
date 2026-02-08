package br.com.autoflex.domain.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "raw_materials")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class RawMaterial {

    @Id @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private Double cost;

    @Column(nullable = false)
    private Double currentStock;

}
