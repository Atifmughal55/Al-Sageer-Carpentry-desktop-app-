import express from "express";
import cors from "cors";
import { initDB } from "./db/database.js";
import customerRoutes from "./routes/customer.routes.js";
import { createTables } from "./db/createTables.js";

const app = express();
app.use(cors()); //allow frontend access
app.use(express.json()); //Parse JSON from requests

const db = await initDB();
app.locals.db = db;
await createTables(db);
const PORT = 8000;

app.use("/api/customers", customerRoutes); // Mount customer routes

app.listen(PORT, () => {
  console.log("Server is running on port 8000");
});
