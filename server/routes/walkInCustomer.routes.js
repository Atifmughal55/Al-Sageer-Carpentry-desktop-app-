import express from "express";
import {
  addNewWalkInCustomer,
  deleteWalkInCustomer,
  getAllWalkInCustomers,
  getWalkInCustomerById,
  updateWalkInCustomer,
} from "../controllers/walkInCustomer.controller.js";

const router = express.Router();

router.post("/", addNewWalkInCustomer);
router.get("/", getAllWalkInCustomers);
router.get("/:id", getWalkInCustomerById);
router.delete("/:id", deleteWalkInCustomer);
router.put("/:id", updateWalkInCustomer);
export default router;
