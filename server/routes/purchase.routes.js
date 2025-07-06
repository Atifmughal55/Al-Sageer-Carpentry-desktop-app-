import { Router } from "express";
import {
  createNewPurchaseController,
  deletePurchaseController,
  getAllPurchasesController,
  getPurchaseByIDController,
  recoverDeletedPurchases,
  updatePurchaseController,
} from "../controllers/purchase.controllers.js";

const router = Router();

router.post("/", createNewPurchaseController);
router.get("/", getAllPurchasesController);
router.get("/:id", getPurchaseByIDController);
router.delete("/:id", deletePurchaseController);
router.put("/:id", updatePurchaseController);
router.put("/restore/:id", recoverDeletedPurchases);
export default router;
