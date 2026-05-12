import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { motion } from "motion/react";
import api from "../services/api";
import { Usuario } from "../types";

interface LoginProps {
  onLogin: (user: Usuario) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      const res = await api.post<Usuario>("/usuarios", { nombre: name });
      onLogin(res.data);
    } catch (err) {
      alert("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md w-full bg-white border border-zinc-200 p-10 rounded-3xl shadow-xl shadow-zinc-200/50"
    >
      <div className="text-center space-y-2 mb-10">
        <h1 className="text-4xl font-black tracking-tight text-zinc-900">PICAS Y FIJAS</h1>
        <p className="text-zinc-400 text-sm font-medium">Rafael y Karen</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          type="text" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="¿Cuál es tu nombre?"
          className="w-full bg-zinc-50 border border-zinc-200 p-4 rounded-2xl focus:outline-none focus:border-zinc-400 text-center text-lg font-medium transition-all"
        />
        
        <button 
          type="submit"
          disabled={loading || !name.trim()}
          className="w-full bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Empezar a Jugar"}
        </button>
      </form>
    </motion.div>
  );
}
