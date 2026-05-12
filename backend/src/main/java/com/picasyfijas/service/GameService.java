package com.picasyfijas.service;

import com.picasyfijas.entity.Intento;
import com.picasyfijas.entity.Partida;
import com.picasyfijas.entity.Usuario;
import com.picasyfijas.exception.ResourceNotFoundException;
import com.picasyfijas.repository.IntentoRepository;
import com.picasyfijas.repository.PartidaRepository;
import com.picasyfijas.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class GameService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PartidaRepository partidaRepository;

    @Autowired
    private IntentoRepository intentoRepository;

    public Usuario findOrCreateUser(String nombre) {
        return usuarioRepository.findByNombre(nombre)
                .orElseGet(() -> usuarioRepository.save(Usuario.builder().nombre(nombre).victorias(0).build()));
    }

    public List<Usuario> getRanking() {
        List<Usuario> ranking = usuarioRepository.findAll();
        ranking.sort((a, b) -> b.getVictorias() - a.getVictorias());
        return ranking;
    }

    public Partida startNewGame(Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        Partida partida = Partida.builder()
                .numeroSecreto(generateSecret())
                .fecha(LocalDateTime.now())
                .finalizada(false)
                .usuario(usuario)
                .intentos(new ArrayList<>())
                .build();

        return partidaRepository.save(partida);
    }

    @Transactional
    public Intento makeGuess(Long partidaId, String guess) {
        Partida partida = partidaRepository.findById(partidaId)
                .orElseThrow(() -> new ResourceNotFoundException("Partida no encontrada"));

        if (partida.isFinalizada()) {
            throw new RuntimeException("La partida ya ha finalizado");
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

        intentoRepository.save(intento);

        if (fijas == 4) {
            partida.setFinalizada(true);
            Usuario usuario = partida.getUsuario();
            usuario.setVictorias(usuario.getVictorias() + 1);
            usuarioRepository.save(usuario);
            partidaRepository.save(partida);
        }

        return intento;
    }

    public Partida getGame(Long id) {
        return partidaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Partida no encontrada"));
    }

    private String generateSecret() {
        List<Integer> digits = new ArrayList<>();
        for (int i = 0; i < 10; i++) digits.add(i);
        Collections.shuffle(digits);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 4; i++) sb.append(digits.get(i));
        return sb.toString();
    }
}
