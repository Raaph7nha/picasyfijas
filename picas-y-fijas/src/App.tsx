import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Trophy, 
  Gamepad2, 
  History, 
  User as UserIcon, 
  Send, 
  RotateCcw, 
  Loader2,
  AlertCircle,
  CheckCircle2,
  ChevronRight
} from "lucide-react";

// --- Types ---
interface User {
  id: number;
  nombre: string;
  victorias: number;
}

interface Attempt {
  numero: string;
  picas: number;
  fijas: number;
}

interface Game {
  id: number;
  intentos: Attempt[];
  fecha: string;
  usuario_id: number;
  terminada: boolean;
}

// --- Components ---

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [game, setGame] = useState<Game | null>(null);
  const [ranking, setRanking] = useState<User[]>([]);
  const [nameInput, setNameInput] = useState("");
  const [guessInput, setGuessInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'game' | 'ranking'>('game');

  useEffect(() => {
    fetchRanking();
  }, []);

  const fetchRanking = async () => {
    try {
      const res = await fetch("/ranking");
      const data = await res.json();
      setRanking(data);
    } catch (err) {
      console.error("Error fetching ranking:", err);
    }
  };

  const login = async () => {
    if (!nameInput.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: nameInput }),
      });
      const data = await res.json();
      setUser(data);
      fetchRanking();
    } catch (err) {
      setError("Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  const startNewGame = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(`/partida/iniciar/${user.id}`, { method: "POST" });
      const data = await res.json();
      setGame(data);
      setGuessInput("");
      setError(null);
    } catch (err) {
      setError("Error al iniciar partida");
    } finally {
      setLoading(false);
    }
  };

  const submitGuess = async () => {
    if (!game || guessInput.length !== 4 || isNaN(Number(guessInput))) {
      setError("Ingresa 4 dígitos válidos");
      return;
    }
    
    if (new Set(guessInput).size !== 4) {
      setError("Los dígitos no se pueden repetir");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/partida/intento/${game.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numero: guessInput }),
      });
      const attempt = await res.json();
      
      if (res.ok) {
        setGame(prev => {
          if (!prev) return null;
          const updated = { ...prev, intentos: [...prev.intentos, attempt] };
          if (attempt.fijas === 4) {
             updated.terminada = true;
             fetchRanking();
             setUser(u => u ? { ...u, victorias: u.victorias + 1 } : null);
          }
          return updated;
        });
        setGuessInput("");
      } else {
        setError(attempt.error || "Error al procesar el intento");
      }
    } catch (err) {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4 font-sans text-zinc-900">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white border border-zinc-200 p-10 rounded-3xl shadow-xl shadow-zinc-200/50"
        >
          <div className="text-center space-y-2 mb-10">
            <h1 className="text-4xl font-black tracking-tight text-zinc-900">PICAS Y FIJAS</h1>
            <p className="text-zinc-400 text-sm font-medium">Rafael y Karen</p>
          </div>

          <div className="space-y-4">
            <input 
              type="text" 
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="¿Cuál es tu nombre?"
              className="w-full bg-zinc-50 border border-zinc-200 p-4 rounded-2xl focus:outline-none focus:border-zinc-400 text-center text-lg font-medium transition-all"
              onKeyDown={(e) => e.key === 'Enter' && login()}
            />
            
            <button 
              onClick={login}
              disabled={loading || !nameInput.trim()}
              className="w-full bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Empezar a Jugar"}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans flex flex-col">
      <nav className="bg-white border-b border-zinc-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <h1 className="font-black text-xl tracking-tight">PICAS Y FIJAS</h1>
          <div className="flex items-center gap-2 bg-zinc-100 px-3 py-1 rounded-full text-xs font-bold text-zinc-600">
            {user.nombre} • {user.victorias} victorias
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
        <AnimatePresence mode="wait">
          {view === 'game' ? (
            <motion.div 
              key="game"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid md:grid-cols-3 gap-8"
            >
              <div className="md:col-span-2 space-y-6">
                {!game ? (
                  <div className="bg-white border border-zinc-200 p-12 rounded-3xl text-center space-y-6">
                    <h2 className="text-2xl font-bold">¿Listo para el desafío?</h2>
                    <p className="text-zinc-500 max-w-sm mx-auto">He pensado un número de 4 cifras únicas. ¿Puedes adivinarlo?</p>
                    <button 
                      onClick={startNewGame}
                      className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-4 px-10 rounded-2xl transition-all"
                    >
                      Nueva Partida
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-white border border-zinc-200 p-10 rounded-3xl space-y-8 relative overflow-hidden">
                      {game.terminada && (
                        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
                           <div className="bg-green-100 p-4 rounded-full mb-4">
                             <CheckCircle2 className="w-10 h-10 text-green-600" />
                           </div>
                           <h3 className="text-3xl font-black mb-2">¡LO CONSEGUISTE!</h3>
                           <p className="text-zinc-500 mb-6">Has descifrado el número secreto.</p>
                           <button onClick={startNewGame} className="bg-zinc-900 text-white font-bold px-8 py-3 rounded-2xl">Jugar de nuevo</button>
                        </div>
                      )}

                      <div className="flex flex-col items-center gap-8">
                        <div className="flex gap-4">
                          {[0, 1, 2, 3].map(i => (
                            <div key={i} className={`w-16 h-20 bg-zinc-50 border-2 ${guessInput[i] ? 'border-zinc-900 text-zinc-900' : 'border-zinc-200 text-zinc-300'} rounded-2xl flex items-center justify-center text-4xl font-bold transition-all`}>
                              {guessInput[i] || "•"}
                            </div>
                          ))}
                        </div>
                        
                        <div className="w-full max-w-sm space-y-4">
                           <div className="flex gap-2">
                             <input 
                                type="text"
                                maxLength={4}
                                value={guessInput}
                                onChange={(e) => setGuessInput(e.target.value.replace(/\D/g, ''))}
                                placeholder="Escribe 4 dígitos..."
                                className="flex-1 bg-zinc-100 border-none p-4 rounded-2xl text-center text-xl font-bold focus:ring-2 focus:ring-zinc-900 focus:outline-none"
                                onKeyDown={(e) => e.key === 'Enter' && submitGuess()}
                             />
                             <button 
                                onClick={submitGuess}
                                disabled={loading || guessInput.length !== 4 || game.terminada}
                                className="bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-white px-6 rounded-2xl transition-all"
                             >
                                <Send className="w-5 h-5" />
                             </button>
                           </div>
                           {error && <p className="text-red-500 text-xs text-center font-bold">{error}</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                   <h3 className="text-sm font-bold uppercase text-zinc-400 tracking-wider">Tus Intentos</h3>
                   <span className="text-xs bg-zinc-200 text-zinc-600 px-2 py-0.5 rounded-full font-bold">{game?.intentos.length || 0}</span>
                </div>
                <div className="space-y-2">
                  {game?.intentos.slice().reverse().map((attempt, i) => (
                    <div key={i} className="bg-white border border-zinc-200 p-4 rounded-2xl flex items-center justify-between">
                      <span className="text-xl font-black text-zinc-900 tracking-widest">{attempt.numero}</span>
                      <div className="flex gap-3 text-xs font-bold">
                        <div className="text-center">
                          <p className="text-zinc-400 text-[9px] uppercase">Picas</p>
                          <p className="text-orange-500">{attempt.picas}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-zinc-400 text-[9px] uppercase">Fijas</p>
                          <p className="text-green-600">{attempt.fijas}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {(!game || game.intentos.length === 0) && (
                    <div className="text-center py-10 border-2 border-dashed border-zinc-200 rounded-3xl text-zinc-300">
                      <History className="w-8 h-8 mx-auto mb-2 opacity-20" />
                      <p className="text-xs font-bold uppercase tracking-wider">Sin intentos</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="ranking"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-sm"
            >
              <div className="p-8 border-b border-zinc-100 flex items-center justify-between">
                <h2 className="text-2xl font-black tracking-tight">RANKING GLOBAL</h2>
                <Trophy className="text-zinc-300 w-6 h-6" />
              </div>
              
              <div className="divide-y divide-zinc-100">
                {ranking.map((player, i) => (
                  <div key={player.id} className={`p-6 flex items-center justify-between ${player.id === user.id ? 'bg-zinc-50' : ''}`}>
                    <div className="flex items-center gap-6">
                      <span className="text-2xl font-black text-zinc-200 italic w-8">{i + 1}</span>
                      <div>
                        <p className="font-bold text-lg">{player.nombre}</p>
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Agente Certificado</p>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="text-2xl font-black italic">{player.victorias}</p>
                       <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest leading-none">Victorias</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="p-8 text-center border-t border-zinc-200 mt-auto">
        <p className="text-zinc-400 text-sm font-medium uppercase tracking-[0.2em]">Rafael y Karen</p>
      </footer>
    </div>
  );
}
