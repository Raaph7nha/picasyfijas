package com.picasyfijas.dto;

import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResultDTO {
    private int picas;
    private int fijas;
    private boolean finalizada;
}
