import { Router } from "express";
import {
  createInvoiceController,
  deleteInvoiceController,
  getAllInvoiceController,
  getInvoiceByIdController,
} from "../controllers/invoice.controllers.js";

const router = Router();

router.get("/", getAllInvoiceController);
router.get("/:id", getInvoiceByIdController); // Assuming you want to use the same controller for both routes
router.post("/", createInvoiceController);
router.delete("/:id", deleteInvoiceController);
export default router;
