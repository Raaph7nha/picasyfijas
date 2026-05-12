import React, { useState } from "react";
import { Send, Loader2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import api from "../services/api";
import { Partida, Intento } from "../types";

interface GameProps {
  game: Partida;
  setGame: React.Dispatch<React.SetStateAction<Partida | null>>;
  onGameComplete: () => void;
}

export default function Game({ game, setGame, onGameComplete }: GameProps) {
  const [guess, setGuess] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (guess.length !== 4) return;
    
    if (new Set(guess).size !== 4) {
      setError("Los d\u00edgitos no se pueden repetir");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await api.post<Intento>(`/partida/intento/${game.id}`, { numero: guess });
      const newIntento = res.data;
      
      setGame(prev => {
        if (!prev) return null;
        const updated = { ...prev, intentos: [...prev.intentos, newIntento] };
        if (newIntento.fijas === 4) {
          updated.finalizada = true;
          onGameComplete();
        }
        return updated;
      });
      setGuess("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al procesar el intento");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div 
        layout
        className="bg-white border border-zinc-200 p-10 rounded-3xl space-y-8 relative overflow-hidden shadow-sm"
      >
        <AnimatePresence>
          {game.finalizada && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-white/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-6 text-center"
            >
               <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 12 }}
                className="bg-green-100 p-4 rounded-full mb-4"
               >
                 <CheckCircle2 className="w-10 h-10 text-green-600" />
               </motion.div>
               <h3 className="text-3xl font-black mb-2">\u00A1LO CONSEGUISTE!</h3>
               <p className="text-zinc-500 mb-6 font-medium">Has descifrado el n\u00famero secreto.</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col items-center gap-8">
          <div className="flex gap-4">
            {[0, 1, 2, 3].map(i => (
              <motion.div 
                key={i} 
                animate={guess[i] ? { scale: 1.1 } : { scale: 1 }}
                className={`w-14 h-18 md:w-16 md:h-20 bg-zinc-50 border-2 ${guess[i] ? 'border-zinc-900 text-zinc-900 shadow-lg shadow-zinc-200' : 'border-zinc-200 text-zinc-300'} rounded-2xl flex items-center justify-center text-4xl font-bold transition-all`}
              >
                {guess[i] || "\u2022"}
              </motion.div>
            ))}
          </div>
          
          <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
             <div className="flex gap-2">
               <input 
                  type="text"
                  maxLength={4}
                  value={guess}
                  onChange={(e) => setGuess(e.target.value.replace(/\D/g, ''))}
                  placeholder="4 d\u00edgitos únicos..."
                  className="flex-1 bg-zinc-100 border-none p-4 rounded-2xl text-center text-xl font-bold focus:ring-2 focus:ring-zinc-900 focus:outline-none"
               />
               <button 
                  type="submit"
                  disabled={loading || guess.length !== 4 || game.finalizada}
                  className="bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-white px-6 rounded-2xl transition-all"
               >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
               </button>
             </div>
             {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-xs text-center font-bold">{error}</motion.p>}
          </form>
        </div>
      </motion.div>
    </div>
  );
}
