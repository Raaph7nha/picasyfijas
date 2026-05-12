import { History } from "lucide-react";
import { Intento } from "../types";

interface HistoryProps {
  intentos: Intento[];
}

export default function GameHistory({ intentos }: HistoryProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
         <h3 className="text-sm font-bold uppercase text-zinc-400 tracking-wider">Historial</h3>
         <span className="text-xs bg-zinc-200 text-zinc-600 px-2 py-0.5 rounded-full font-bold">{intentos.length}</span>
      </div>
      <div className="space-y-2">
        {intentos.slice().reverse().map((attempt, i) => (
          <div key={i} className="bg-white border border-zinc-200 p-4 rounded-2xl flex items-center justify-between shadow-sm">
            <span className="text-xl font-black text-zinc-900 tracking-widest">{attempt.numero}</span>
            <div className="flex gap-3 text-xs font-bold font-mono">
              <div className="text-center">
                <p className="text-zinc-400 text-[9px] uppercase font-sans">Picas</p>
                <p className="text-orange-500">{attempt.picas}</p>
              </div>
              <div className="text-center">
                <p className="text-zinc-400 text-[9px] uppercase font-sans">Fijas</p>
                <p className="text-green-600">{attempt.fijas}</p>
              </div>
            </div>
          </div>
        ))}
        {intentos.length === 0 && (
          <div className="text-center py-10 border-2 border-dashed border-zinc-100 rounded-3xl text-zinc-300">
            <History className="w-8 h-8 mx-auto mb-2 opacity-20" />
            <p className="text-xs font-bold uppercase tracking-wider">Sin intentos</p>
          </div>
        )}
      </div>
    </div>
  );
}
