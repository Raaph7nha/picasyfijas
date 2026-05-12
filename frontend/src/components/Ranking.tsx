import React from "react";
import { Trophy, Loader2 } from "lucide-react";
import { Usuario } from "../types";

interface RankingProps {
  ranking: Usuario[];
  currentUser: Usuario | null;
}

export default function Ranking({ ranking, currentUser }: RankingProps) {
  return (
    <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-sm">
      <div className="p-8 border-b border-zinc-100 flex items-center justify-between">
        <h2 className="text-2xl font-black tracking-tight">RANKING GLOBAL</h2>
        <Trophy className="text-zinc-300 w-6 h-6" />
      </div>
      
      <div className="divide-y divide-zinc-100 max-h-[600px] overflow-y-auto">
        {ranking.map((player, i) => (
          <div key={player.id} className={`p-6 flex items-center justify-between ${player.id === currentUser?.id ? 'bg-zinc-50' : ''}`}>
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
        {ranking.length === 0 && (
          <div className="p-10 text-center text-zinc-400">
            <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
            <p className="text-sm">Cargando...</p>
          </div>
        )}
      </div>
    </div>
  );
}
