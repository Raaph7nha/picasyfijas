package com.picasyfijas.controller;

import com.picasyfijas.entity.Usuario;
import com.picasyfijas.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private GameService gameService;

    @PostMapping("/usuarios")
    public Usuario login(@RequestBody Map<String, String> body) {
        return gameService.findOrCreateUser(body.get("nombre"));
    }

    @GetMapping("/ranking")
    public List<Usuario> getRanking() {
        return gameService.getRanking();
    }
}
