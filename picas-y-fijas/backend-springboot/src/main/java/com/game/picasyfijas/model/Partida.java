package com.game.picasyfijas.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "partidas")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Partida {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String numeroSecreto;

    private LocalDateTime fecha;

    private boolean terminada;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @OneToMany(mappedBy = "partida", cascade = CascadeType.ALL)
    private List<Intento> intentos;
}
