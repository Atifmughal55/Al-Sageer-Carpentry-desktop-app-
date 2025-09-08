import { Router } from "express";
import {
  createNewPurchaseController,
  deletePurchaseController,
  getAllPurchasesController,
  getPurchaseByIDController,
  getPurchaseByPurchaseNoController,
  permanentlyDeletePurchaseController,
  recoverDeletedPurchases,
  updatePurchaseController,
} from "../controllers/purchase.controllers.js";

const router = Router();

router.post("/", createNewPurchaseController);
router.get("/", getAllPurchasesController);
router.get("/:id", getPurchaseByIDController);
router.get("/search/:purchaseNo", getPurchaseByPurchaseNoController);
router.delete("/:id", deletePurchaseController);
router.put("/:id", updatePurchaseController);
router.put("/restore/:id", recoverDeletedPurchases);
router.delete("/delete/:id", permanentlyDeletePurchaseController);
export default router;
