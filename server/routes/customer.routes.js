import express from "express";
import {
  addNewCustomer,
  deleteCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
} from "../controllers/customer.controllers.js";
const router = express.Router();

router.get("/", getAllCustomers);
router.get("/:id", getCustomerById);
router.post("/", addNewCustomer);
router.put("/:id", updateCustomer);
router.delete("/:id", deleteCustomer);
export default router;
