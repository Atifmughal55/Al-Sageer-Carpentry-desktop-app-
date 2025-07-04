import { Router } from "express";
import {
  createInvoiceController,
  deleteInvoiceController,
  getAllInvoiceController,
  getInvoiceByIdController,
  getInvoiceByQuotationNoController,
  getInvoiceItemByInvoicenoController,
  restoreInvoiceController,
  searchInvoiceController,
  updateInvoiceController,
} from "../controllers/invoice.controllers.js";

const router = Router();

router.get("/invoice/search", searchInvoiceController);
router.get("/invoice/:quotation_no", getInvoiceByQuotationNoController); // For fetching by quotation_no
router.get("/", getAllInvoiceController);
router.post("/", createInvoiceController);
router.get("/:id", getInvoiceByIdController); // Assuming you want to use the same controller for both routes
router.put("/recover-invoice/:id", restoreInvoiceController);
router.delete("/:id", deleteInvoiceController);
router.get(
  "/invoice/invoice-items/:invoice_no",
  getInvoiceItemByInvoicenoController
);
router.put("/invoice/:id", updateInvoiceController);
export default router;
