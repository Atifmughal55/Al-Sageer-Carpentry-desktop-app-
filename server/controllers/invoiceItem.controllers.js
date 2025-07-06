import {
  createInvoiceItemModel,
  deleteInvoiceItemModel,
  getAllInvoiceItemsModel,
  getSingleInvoiceItemModel,
  updateInvoiceItemModel,
} from "../models/invoiceItem.model.js";
import { generateInvoiceNo } from "../utils/generateId.js";

//get All the invoice items
export const getAllInvoiceItems = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const invoiceItems = await getAllInvoiceItemsModel(db);

    return res.status(200).json({
      success: true,
      error: false,
      message: "fetched all the invoice items",
      totalInvoiceItems: invoiceItems.length,
      data: invoiceItems,
    });
  } catch (error) {
    console.log("Error while fetching invoice items: ", error || error.message);
    return res.status(500).json({
      success: false,
      error: true,
      message: "Something went wrong while fetching invoice items",
    });
  }
};

//get invoice item By ID
export const getInvoiceItem = async (req, res) => {
  try {
    const { id } = req.params;
    const db = req.app.locals.db;
    const invoiceItem = await getSingleInvoiceItemModel(db, id);

    if (!invoiceItem) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Invoice item not found",
      });
    }
    return res.status(200).json({
      success: true,
      error: false,
      message: "Invoice item fetched",
      data: invoiceItem,
    });
  } catch (error) {
    console.log("Error while fetching invoice Item: ", error || error.message);
    return res.status(500).json({
      success: false,
      error: true,
      message: "Something went wrong while fetching invoice item",
    });
  }
};

//Create new Invoice item
export const newInvoiceItem = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { invoice_id, description, quantity, unit_price, vat } = req.body;

    // Validate inputs
    if (!invoice_id || !description || !quantity || !unit_price || !vat) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "All fields are required",
      });
    }

    // Build item data
    const data = {
      invoice_id,
      description,
      quantity,
      unit_price,
      vat,
    };

    // Insert into DB
    const newInvoiceItem = await createInvoiceItemModel(db, data);

    // Fetch the inserted item (with computed columns)
    const insertedItem = await getSingleInvoiceItemModel(
      db,
      newInvoiceItem.lastID
    );

    return res.status(201).json({
      success: true,
      error: false,
      message: "New invoice item added",
      data: insertedItem,
    });
  } catch (error) {
    console.error("Error while creating new invoice item:", error.message);
    return res.status(500).json({
      success: false,
      error: true,
      message: "Something went wrong while creating the invoice item.",
    });
  }
};

//Update invoice item
export const updateInvoiceItem = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { id } = req.params;
    const { invoice_id, description, quantity, unit_price, vat } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Invalid item ID",
      });
    }

    const checkItem = await getSingleInvoiceItemModel(db, id);
    if (!checkItem) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Item not found",
      });
    }

    const updatedData = {};
    if (invoice_id !== undefined) updatedData.invoice_id = invoice_id;
    if (description !== undefined) updatedData.description = description;
    if (quantity !== undefined) updatedData.quantity = quantity;
    if (unit_price !== undefined) updatedData.unit_price = unit_price;
    if (vat !== undefined) updatedData.vat = vat;

    if (Object.keys(updatedData).length === 0) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "No field to update",
      });
    }

    await updateInvoiceItemModel(db, updatedData, id);
    const updatedItem = await getSingleInvoiceItemModel(db, id);

    return res.status(200).json({
      success: true,
      error: false,
      message: "Updated invoice item successfully.",
      data: updatedItem,
    });
  } catch (error) {
    console.error("Error while updating invoice item:", error);
    return res.status(500).json({
      success: false,
      error: true,
      message: "Something went wrong while updating invoice item",
    });
  }
};

//Delete invoice item
export const deleteInvoiceItem = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { id } = req.params;

    // lets check if the item available
    const checkItem = await getSingleInvoiceItemModel(db, id);
    if (!checkItem) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Invoice item not found",
      });
    }

    await deleteInvoiceItemModel(db, id);
    return res.status(200).json({
      success: true,
      error: false,
      message: "Invoice item deleted successfully",
    });
  } catch (error) {
    console.log("Error while deleting invoice item: ", error || error.message);
    return res.status(500).json({
      success: false,
      error: true,
      message: "Something went wrong while deleting invoice item",
    });
  }
};
