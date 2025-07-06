import sqlite from "sqlite3";
import { open } from "sqlite";

export const initDB = async () => {
  return open({
    filename: "./db/al-sageer.db",
    driver: sqlite.Database,
  });
};
