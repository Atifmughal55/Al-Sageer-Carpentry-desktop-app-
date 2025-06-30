import { Router } from "express";
import {
  createInvoiceController,
  deleteInvoiceController,
  getAllInvoiceController,
  getInvoiceByIdController,
  getInvoiceByQuotationNoController,
  restoreInvoiceController,
} from "../controllers/invoice.controllers.js";

const router = Router();

router.get("/", getAllInvoiceController);
router.get("/:id", getInvoiceByIdController); // Assuming you want to use the same controller for both routes
router.get("/invoice/:quotation_no", getInvoiceByQuotationNoController); // For fetching by quotation_no
router.post("/", createInvoiceController);
router.delete("/:id", deleteInvoiceController);
router.put("/recover-invoice/:id", restoreInvoiceController);
export default router;
