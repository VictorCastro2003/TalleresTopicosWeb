const express = require("express"); 
const sqlite3 = require("sqlite3").verbose(); 
const path = require("path");

const app = express();
const PORT = 3000;


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); 


const db = new sqlite3.Database("./database.db", (err) => { 
    if (err) {
        console.error("Error al conectar a la base de datos:", err.message);
    } else {
        console.log("Conectado a la base de datos SQLite");

        db.run(`
            CREATE TABLE IF NOT EXISTS personas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL,
                edad INTEGER NOT NULL
            )
        `, (err) => {
            if (err) console.error("Error al crear la tabla:", err.message);
            else console.log("Tabla 'personas' creada o ya existente");
        });
    }
});


app.post("/api/personas", (req, res) => {
    const { nombre, edad } = req.body; 
    db.run(
        "INSERT INTO personas (nombre, edad) VALUES (?, ?)",
        [nombre, edad],
        (err) => {
            if (err) {
                console.error(" Error al insertar persona:", err.message);
                res.status(500).json({ error: "Error al insertar persona" });
            } else {
                console.log(" Persona agregada:", nombre, edad);
                res.status(201).json({ mensaje: "Persona agregada correctamente" });
            }
        }
    );
});


app.get("/api/personas", (req, res) => { 
    db.all("SELECT * FROM personas", (err, rows) => {
        if (err) {
            console.error("Error al recuperar personas:", err.message);
            res.status(500).json({ error: "Error al recuperar personas" });
        } else {
            res.json(rows);
        }
    });
});


app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
