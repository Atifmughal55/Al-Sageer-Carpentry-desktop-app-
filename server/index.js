import express from "express";
import cors from "cors";
import { initDB } from "./db/database.js";
import customerRoutes from "./routes/customer.routes.js";
import invoiceItemRoutes from "./routes/invoiceItems.routes.js";
import quotationItem from "./routes/quotationItems.routes.js";
import quotations from "./routes/quotation.routes.js";
import invoices from "./routes/invoice.routes.js";
import purchaseRoutes from "./routes/purchase.routes.js";
import { createTables } from "./db/createTables.js";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", // your frontend URL
    credentials: true, // allow credentials like cookies, headers
  })
); //allow frontend access
app.use(express.json()); //Parse JSON from requests

const db = await initDB();
app.locals.db = db;
await createTables(db);
const PORT = 8000;

app.use("/api/customers", customerRoutes); // Mount customer routes
app.use("/api/invoice-items", invoiceItemRoutes);
app.use("/api/quotaton-item", quotationItem);
app.use("/api/quotations", quotations);
app.use("/api/invoices", invoices);
app.use("/api/purchases", purchaseRoutes);

app.listen(PORT, () => {
  console.log("Server is running on port 8000");
});
