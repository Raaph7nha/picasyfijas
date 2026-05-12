import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import pg from "pg";

const { Pool } = pg;

// Use the database URL provided by the user
const pool = new Pool({
  connectionString: "postgresql://rafael:GB2SYaTKNjbWEC67z3QNu7jdv2911j48@dpg-d81joppj2pic73fp66g0-a.oregon-postgres.render.com/picas_fijas?ssl=true",
});

async function initDb() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(255) UNIQUE NOT NULL,
        victorias INT DEFAULT 0
      );
      CREATE TABLE IF NOT EXISTS partidas (
        id SERIAL PRIMARY KEY,
        numero_secreto VARCHAR(4) NOT NULL,
        fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        terminada BOOLEAN DEFAULT FALSE,
        usuario_id INT REFERENCES usuarios(id)
      );
      CREATE TABLE IF NOT EXISTS intentos (
        id SERIAL PRIMARY KEY,
        numero VARCHAR(4) NOT NULL,
        picas INT NOT NULL,
        fijas INT NOT NULL,
        partida_id INT REFERENCES partidas(id)
      );
    `);
  } finally {
    client.release();
  }
}

async function startServer() {
  await initDb();
  
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Helper function to generate secret number
  const generateSecret = () => {
    const digits: number[] = [];
    while (digits.length < 4) {
      const d = Math.floor(Math.random() * 10);
      if (!digits.includes(d)) digits.push(d);
    }
    return digits.join("");
  };

  // Helper to calculate Bulls and Cows
  const calculateResult = (secret: string, guess: string) => {
    let fijas = 0;
    let picas = 0;
    for (let i = 0; i < 4; i++) {
        if (!secret) return { picas: 0, fijas: 0 };
      if (guess[i] === secret[i]) {
        fijas++;
      } else if (secret.includes(guess[i])) {
        picas++;
      }
    }
    return { picas, fijas };
  };

  // --- API Endpoints ---

  // POST /usuarios
  app.post("/usuarios", async (req, res) => {
    const { nombre } = req.body;
    if (!nombre) return res.status(400).json({ error: "Nombre es requerido" });
    
    try {
      let result = await pool.query("SELECT * FROM usuarios WHERE nombre = $1", [nombre]);
      if (result.rows.length === 0) {
        result = await pool.query("INSERT INTO usuarios (nombre, victorias) VALUES ($1, 0) RETURNING *", [nombre]);
      }
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: "Error en la base de datos" });
    }
  });

  // GET /ranking
  app.get("/ranking", async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM usuarios ORDER BY victorias DESC");
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: "Error en la base de datos" });
    }
  });

  // POST /partida/iniciar/{usuarioId}
  app.post("/partida/iniciar/:usuarioId", async (req, res) => {
    const usuarioId = parseInt(req.params.usuarioId);
    try {
        const secret = generateSecret();
        const result = await pool.query(
            "INSERT INTO partidas (numero_secreto, usuario_id) VALUES ($1, $2) RETURNING id, fecha, terminada, usuario_id",
            [secret, usuarioId]
        );
        res.json({ ...result.rows[0], intentos: [] });
    } catch (err) {
        res.status(500).json({ error: "Error al iniciar partida" });
    }
  });

  // POST /partida/intento/{id}
  app.post("/partida/intento/:id", async (req, res) => {
    const gameId = parseInt(req.params.id);
    const { numero } = req.body;
    
    if (!numero || numero.length !== 4) return res.status(400).json({ error: "Número inválido" });

    try {
      const gameResult = await pool.query("SELECT * FROM partidas WHERE id = $1", [gameId]);
      if (gameResult.rows.length === 0) return res.status(404).json({ error: "Partida no encontrada" });
      
      const game = gameResult.rows[0];
      if (game.terminada) return res.status(400).json({ error: "Esta partida ya ha terminado" });

      const { picas, fijas } = calculateResult(game.numero_secreto, numero);
      
      await pool.query("BEGIN");
      const intentoResult = await pool.query(
        "INSERT INTO intentos (numero, picas, fijas, partida_id) VALUES ($1, $2, $3, $4) RETURNING *",
        [numero, picas, fijas, gameId]
      );

      if (fijas === 4) {
        await pool.query("UPDATE partidas SET terminada = TRUE WHERE id = $1", [gameId]);
        await pool.query("UPDATE usuarios SET victorias = victorias + 1 WHERE id = $1", [game.usuario_id]);
      }
      await pool.query("COMMIT");

      res.json(intentoResult.rows[0]);
    } catch (err) {
      await pool.query("ROLLBACK");
      res.status(500).json({ error: "Error al procesar el intento" });
    }
  });

  // GET /partida/{id}
  app.get("/partida/:id", async (req, res) => {
    const gameId = parseInt(req.params.id);
    try {
      const gameResult = await pool.query("SELECT id, fecha, terminada, usuario_id FROM partidas WHERE id = $1", [gameId]);
      if (gameResult.rows.length === 0) return res.status(404).json({ error: "Partida no encontrada" });
      
      const intentosResult = await pool.query("SELECT * FROM intentos WHERE partida_id = $1", [gameId]);
      res.json({ ...gameResult.rows[0], intentos: intentosResult.rows });
    } catch (err) {
      res.status(500).json({ error: "Error en la base de datos" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      root: "frontend",
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "frontend/dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
