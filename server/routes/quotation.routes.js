import { Router } from "express";
import {
  createQuotation,
  deleteQuotatoin,
  getAllQuotations,
  getQuotation,
  getQuotationsWithCustomer,
  updateQuotation,
  updateStatus,
} from "../controllers/quotation.controllers.js";

const router = Router();

router.get("/:id", getQuotation);
router.get("/", getAllQuotations);
router.get("/with-customers", getQuotationsWithCustomer);
router.post("/", createQuotation);
router.delete("/:id", deleteQuotatoin);
router.put("/update/:id", updateQuotation);
router.put("/:id/status", updateStatus);
export default router;
