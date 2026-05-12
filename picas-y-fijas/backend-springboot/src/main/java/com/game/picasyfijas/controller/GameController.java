package com.game.picasyfijas.controller;

import com.game.picasyfijas.model.Intento;
import com.game.picasyfijas.model.Partida;
import com.game.picasyfijas.service.GameService;
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
    public Partida iniciar(@PathVariable Long usuarioId) {
        return gameService.iniciarPartida(usuarioId);
    }

    @PostMapping("/intento/{id}")
    public Intento intentar(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return gameService.procesarIntento(id, body.get("numero"));
    }

    @GetMapping("/{id}")
    public Partida getPartida(@PathVariable Long id) {
        return gameService.getPartida(id);
    }
}
