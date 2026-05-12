package com.game.picasyfijas.service;

import com.game.picasyfijas.model.Intento;
import com.game.picasyfijas.model.Partida;
import com.game.picasyfijas.model.Usuario;
import com.game.picasyfijas.repository.PartidaRepository;
import com.game.picasyfijas.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;

@Service
public class GameService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PartidaRepository partidaRepository;

    public Usuario crearOUtilisarUsuario(String nombre) {
        return usuarioRepository.findByNombre(nombre)
                .orElseGet(() -> usuarioRepository.save(
                        Usuario.builder().nombre(nombre).victorias(0).build()
                ));
    }

    public List<Usuario> getRanking() {
        List<Usuario> ranking = usuarioRepository.findAll();
        ranking.sort((a, b) -> b.getVictorias() - a.getVictorias());
        return ranking;
    }

    public Partida iniciarPartida(Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Partida partida = Partida.builder()
                .numeroSecreto(generarNumeroSecreto())
                .fecha(LocalDateTime.now())
                .usuario(usuario)
                .terminada(false)
                .intentos(new ArrayList<>())
                .build();

        return partidaRepository.save(partida);
    }

    public Intento procesarIntento(Long partidaId, String guess) {
        Partida partida = partidaRepository.findById(partidaId)
                .orElseThrow(() -> new RuntimeException("Partida no encontrada"));

        if (partida.isTerminada()) {
            throw new RuntimeException("La partida ya ha finalizado");
        }

        if (guess.length() != 4 || hasRepeatingDigits(guess)) {
            throw new RuntimeException("Número inválido: debe tener 4 dígitos no repetidos");
        }

        String secret = partida.getNumeroSecreto();
        int fijas = 0;
        int picas = 0;

        for (int i = 0; i < 4; i++) {
            if (guess.charAt(i) == secret.charAt(i)) {
                fijas++;
            } else if (secret.contains(String.valueOf(guess.charAt(i)))) {
                picas++;
            }
        }

        Intento intento = Intento.builder()
                .numero(guess)
                .picas(picas)
                .fijas(fijas)
                .partida(partida)
                .build();

        partida.getIntentos().add(intento);

        if (fijas == 4) {
            partida.setTerminada(true);
            Usuario usuario = partida.getUsuario();
            usuario.setVictorias(usuario.getVictorias() + 1);
            usuarioRepository.save(usuario);
        }

        partidaRepository.save(partida);
        return intento;
    }

    public Partida getPartida(Long id) {
        return partidaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Partida no encontrada"));
    }

    private String generarNumeroSecreto() {
        List<Integer> digits = new ArrayList<>();
        for (int i = 0; i < 10; i++) digits.add(i);
        Collections.shuffle(digits);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 4; i++) sb.append(digits.get(i));
        return sb.toString();
    }

    private boolean hasRepeatingDigits(String s) {
        for (int i = 0; i < s.length(); i++) {
            for (int j = i + 1; j < s.length(); j++) {
                if (s.charAt(i) == s.charAt(j)) return true;
            }
        }
        return false;
    }
}
