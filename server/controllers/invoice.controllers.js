import {
  createInvoiceModel,
  deleteInvoiceModel,
  getAllInvoiceModel,
  getInvoiceByIdModel,
} from "../models/invoice.model.js";

export const getAllInvoiceController = async (req, res) => {
  const { db } = req.app.locals;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  try {
    const invoices = await getAllInvoiceModel(db, limit, offset);
    if (!invoices || invoices.length === 0) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "No invoices found",
      });
    }
    res.status(200).json({
      success: true,
      error: false,
      message: "Invoices retrieved successfully",
      data: invoices,
      pagination: {
        page,
        limit,
        total: invoices.length, // This should ideally be the total count of invoices
      },
    });
  } catch (error) {
    console.log("Error in getAllInvoiceController:", error);
    res.status(500).json({
      success: false,
      error: true,
      message: "Internal Server Error",
    });
  }
};

export const getInvoiceByIdController = async (req, res) => {
  const { db } = req.app.locals;
  const { id } = req.params;
  try {
    const { invoice, customer, invoice_items } = await getInvoiceByIdModel(
      db,
      id
    );
    if (!invoice) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Invoice not found",
      });
    }
    res.status(200).json({
      success: true,
      error: false,
      message: "Invoice retrieved successfully",
      data: {
        invoice,
        customer,
        invoice_items,
      },
    });
  } catch (error) {
    console.log("Error in getInvoiceByIdController:", error);
    res.status(500).json({
      success: false,
      error: true,
      message: "Internal Server Error",
    });
  }
};

export const createInvoiceController = async (req, res) => {
  const { db } = req.app.locals;
  const invoiceData = req.body;
  try {
    const invoice = await createInvoiceModel(db, invoiceData);
    if (!invoice) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Failed to create invoice",
      });
    }
    res.status(201).json({
      success: true,
      error: false,
      message: "Invoice created successfully",
      data: invoice,
    });
  } catch (error) {
    console.log("Error in createInvoiceController:", error);
    res.status(500).json({
      success: false,
      error: true,
      message: "Internal Server Error",
    });
  }
};

export const deleteInvoiceController = async (req, res) => {
  const { db } = req.app.locals;
  const { id } = req.params;
  try {
    // Check if the invoice exists
    const invoice = await getInvoiceByIdModel(db, id);

    if (!invoice.invoice) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Invoice not found",
      });
    }
    await deleteInvoiceModel(db, id);
    res.status(200).json({
      success: true,
      error: false,
      message: "Invoice deleted successfully",
    });
  } catch (error) {
    console.log("Error in deleteInvoiceController:", error);
    res.status(500).json({
      success: false,
      error: true,
      message: "Internal Server Error",
    });
  }
};
