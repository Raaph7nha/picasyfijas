package com.picasyfijas.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioDTO {
    private Long id;
    private String nombre;
    private int victorias;
}
