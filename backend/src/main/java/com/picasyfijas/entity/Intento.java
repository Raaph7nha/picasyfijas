package com.picasyfijas.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "intentos")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Intento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String numero;
    private int picas;
    private int fijas;

    @ManyToOne
    @JoinColumn(name = "partida_id")
    private Partida partida;
}
