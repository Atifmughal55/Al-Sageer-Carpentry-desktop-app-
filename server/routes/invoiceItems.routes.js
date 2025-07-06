import { Router } from "express";
import {
  deleteInvoiceItem,
  getAllInvoiceItems,
  getInvoiceItem,
  newInvoiceItem,
  updateInvoiceItem,
} from "../controllers/invoiceItem.controllers.js";

const router = Router();

router.get("/", getAllInvoiceItems);
router.get("/:id", getInvoiceItem);
router.post("/", newInvoiceItem);
router.put("/:id", updateInvoiceItem);
router.delete("/:id", deleteInvoiceItem);
export default router;
