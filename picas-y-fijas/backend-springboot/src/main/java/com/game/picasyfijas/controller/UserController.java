package com.game.picasyfijas.controller;

import com.game.picasyfijas.model.Usuario;
import com.game.picasyfijas.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*") // Para desarrollo
public class UserController {

    @Autowired
    private GameService gameService;

    @PostMapping("/usuarios")
    public Usuario login(@RequestBody Map<String, String> body) {
        return gameService.crearOUtilisarUsuario(body.get("nombre"));
    }

    @GetMapping("/ranking")
    public List<Usuario> getRanking() {
        return gameService.getRanking();
    }
}
