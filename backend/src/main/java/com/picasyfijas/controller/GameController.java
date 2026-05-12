package com.picasyfijas.controller;

import com.picasyfijas.entity.Intento;
import com.picasyfijas.entity.Partida;
import com.picasyfijas.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/partida")
@CrossOrigin(origins = "*")
public class GameController {

    @Autowired
    private GameService gameService;

    @PostMapping("/iniciar/{usuarioId}")
    public Partida start(@PathVariable Long usuarioId) {
        return gameService.startNewGame(usuarioId);
    }

    @PostMapping("/intento/{id}")
    public Intento guess(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return gameService.makeGuess(id, body.get("numero"));
    }

    @GetMapping("/{id}")
    public Partida getGame(@PathVariable Long id) {
        return gameService.getGame(id);
    }
}
