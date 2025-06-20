import { Router } from "express";
import {
  createQuotaitonItem,
  deleteQuotationItem,
  getAllQuotationItems,
  getQuotationItem,
  updateQuotationItem,
} from "../controllers/quotationItem.controllers.js";

const router = Router();

router.get("/", getAllQuotationItems);
router.get("/:id", getQuotationItem);
router.post("/", createQuotaitonItem);
router.put("/:id", updateQuotationItem);
router.delete("/:id", deleteQuotationItem);

export default router;
