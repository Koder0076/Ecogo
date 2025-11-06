import express from "express";
import sqlite3 from "sqlite3";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// База даних
const db = new sqlite3.Database(path.join(__dirname, "volunteers.db"));

db.run(`
CREATE TABLE IF NOT EXISTS volunteers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT,
  age INTEGER,
  country TEXT,
  city TEXT,
  social TEXT,
  role TEXT,
  message TEXT
)
`);

// Обробка форми
app.post("/submit", (req, res) => {
  const { name, email, age, country, city, social, role, message } = req.body;

  db.run(
    `INSERT INTO volunteers (name, email, age, country, city, social, role, message)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, email, age, country, city, social, role, message],
    function (err) {
      if (err) {
        console.error(err);
        res.status(500).send("Помилка збереження даних");
      } else {
        res.send("Форма успішно надіслана!");
      }
    }
  );
});

// Отримати всі заявки (для адмінки)
app.get("/volunteers", (req, res) => {
  db.all("SELECT * FROM volunteers", [], (err, rows) => {
    if (err) {
      res.status(500).send("Помилка бази даних");
    } else {
      res.json(rows);
    }
  });
});

// Видалити всі заявки
app.delete("/volunteers", (req, res) => {
  db.run("DELETE FROM volunteers", (err) => {
    if (err) res.status(500).send("Помилка видалення");
    else res.send("Усі записи видалено");
  });
});

// Запуск сервера
app.listen(PORT, () => console.log(`✅ Сервер запущено на http://localhost:${PORT}`));