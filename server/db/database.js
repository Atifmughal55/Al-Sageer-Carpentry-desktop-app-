import sqlite from "sqlite3";
import { open } from "sqlite";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const initDB = async () => {
  const dbPath = path.join(__dirname, "al-sageer.db");

  // Ensure current folder exists (usually it does, but safe check)
  if (!fs.existsSync(__dirname)) {
    fs.mkdirSync(__dirname, { recursive: true });
  }

  return open({
    filename: dbPath,
    driver: sqlite.Database,
  });
};
