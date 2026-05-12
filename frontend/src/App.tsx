import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import Game from "./components/Game";
import History from "./components/History";
import Ranking from "./components/Ranking";
import api from "./services/api";
import { Usuario, Partida } from "./types";

export default function App() {
  const [user, setUser] = useState<Usuario | null>(null);
  const [game, setGame] = useState<Partida | null>(null);
  const [ranking, setRanking] = useState<Usuario[]>([]);
  const [view, setView] = useState<'game' | 'ranking'>('game');

  useEffect(() => {
    fetchRanking();
  }, []);

  const fetchRanking = async () => {
    try {
      const res = await api.get<Usuario[]>("/ranking");
      setRanking(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const startNewGame = async () => {
    if (!user) return;
    try {
      const res = await api.post<Partida>(`/partida/iniciar/${user.id}`);
      setGame(res.data);
      setView('game');
    } catch (err) {
      alert("Error al iniciar partida");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
        <Login onLogin={(u) => { setUser(u); fetchRanking(); }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col font-sans">
      <nav className="bg-white border-b border-zinc-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <h1 className="font-black text-xl tracking-tight">PICAS Y FIJAS</h1>
          <div className="flex items-center gap-2 bg-zinc-100 px-3 py-1 rounded-full text-xs font-bold text-zinc-600">
            {user.nombre} \u2022 {user.victorias} victorias
          </div>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => setView('game')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${view === 'game' ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:bg-zinc-100'}`}
          >
            Juego
          </button>
          <button 
            onClick={() => setView('ranking')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${view === 'ranking' ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:bg-zinc-100'}`}
          >
            Ranking
          </button>
        </div>
      </nav>

      <main className="flex-1 max-w-5xl w-full mx-auto p-6">
        {view === 'game' ? (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              {!game ? (
                <div className="bg-white border border-zinc-200 p-12 rounded-3xl text-center space-y-6">
                  <h2 className="text-2xl font-bold">¿Listo para el desafío?</h2>
                  <p className="text-zinc-500 max-w-sm mx-auto">He pensado un número de 4 cifras únicas. ¿Puedes adivinarlo?</p>
                  <button onClick={startNewGame} className="bg-zinc-900 text-white font-bold py-4 px-10 rounded-2xl">Nueva Partida</button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex justify-between items-center px-2">
                    <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Partida #{game.id}</h2>
                    <button onClick={startNewGame} className="text-xs font-bold text-zinc-400 hover:text-zinc-900">Reiniciar</button>
                  </div>
                  <Game game={game} setGame={setGame} onGameComplete={() => { fetchRanking(); setUser(prev => prev ? {...prev, victorias: prev.victorias + 1} : null); }} />
                </div>
              )}
            </div>
            <div>
              <History intentos={game?.intentos || []} />
            </div>
          </div>
        ) : (
          <Ranking ranking={ranking} currentUser={user} />
        )}
      </main>

      <footer className="p-8 text-center border-t border-zinc-200 mt-auto">
        <p className="text-zinc-400 text-sm font-medium uppercase tracking-[0.2em]">Rafael y Karen</p>
      </footer>
    </div>
  );
}
