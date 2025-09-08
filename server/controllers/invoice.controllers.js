import {
  createCustomerModel,
  getCustomerByFieldsModel,
  getCustomerByIdModel,
} from "../models/customer.model.js";
import {
  createInvoiceModel,
  deleteInvoiceModel,
  getAllInvoiceModel,
  getInvoiceByIdModel,
  getInvoiceByQuotationNoModel,
  permanentlyDeleteInvoiceModel,
} from "../models/invoice.model.js";
import { createInvoiceItemModel } from "../models/invoiceItem.model.js";

// get all invoices with pagination and customer info
export const getAllInvoiceController = async (req, res) => {
  const { db } = req.app.locals;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  try {
    // Step 1: Get total count for pagination
    const totalCountResult = await db.get(
      `SELECT COUNT(*) as total FROM invoices `
    );
    const totalCount = totalCountResult?.total || 0;

    // Step 2: Get paginated invoices
    const invoices = await getAllInvoiceModel(db, limit, offset);
    if (!invoices || invoices.length === 0) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "No invoices found",
      });
    }
    // Get invoices (should already filter out soft-deleted ones)
    // Attach customer info to each invoice
    const invoiceWithCustomer = await Promise.all(
      invoices.map(async (invoice) => {
        const customer = await getCustomerByIdModel(invoice.customer_id, db);
        return {
          ...invoice,
          customer,
        };
      })
    );

    // Send response
    res.status(200).json({
      success: true,
      error: false,
      message: "Invoices retrieved successfully",
      data: invoiceWithCustomer,
      pagination: {
        page,
        limit,
        total: totalCount, // ✅ correct total count from DB
      },
    });
  } catch (error) {
    console.error("Error in getAllInvoiceController:", error);
    res.status(500).json({
      success: false,
      error: true,
      message: "Internal Server Error",
    });
  }
};

//get invoice by id
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

//get invoice by quotation number
export const getInvoiceByQuotationNoController = async (req, res) => {
  const { db } = req.app.locals;
  const { quotation_no } = req.params;
  if (!quotation_no) {
    return res.status(400).json({
      success: false,
      error: true,
      message: "Quotation number is required",
    });
  }
  try {
    const { invoice, customer, invoice_items } =
      await getInvoiceByQuotationNoModel(db, quotation_no);
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
    console.log("Error in getInvoiceByQuotationNoController:", error);
    res.status(500).json({
      success: false,
      error: true,
      message: "Internal Server Error",
    });
  }
};

// Create a new invoice
export const createInvoiceController = async (req, res) => {
  const { db } = req.app.locals;
  const invoiceData = req.body;
  const { name, email, phone, address } = invoiceData.customer;

  console.log("Invoice Data: ", invoiceData);
  try {
    let newCustomer;

    // Check if customer exists
    if (invoiceData.customer.id) {
      const customer = await getCustomerByIdModel(invoiceData.customer.id, db);
      if (!customer) {
        return res.status(404).json({
          success: false,
          error: true,
          message: "Customer not found",
        });
      }
    } else {
      // Create a new customer if ID not provided
      newCustomer = await createCustomerModel(db, name, email, phone, address);
    }

    // Create invoice items
    const invoiceItems = invoiceData.invoiceItems.map((item) => {
      const data = {
        invoice_id: invoiceData.invoice.invoiceNo,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        vat: item.vat,
      };
      return createInvoiceItemModel(db, data);
    });
    await Promise.all(invoiceItems);

    // ==== Calculations ====
    const total_amount = invoiceData.invoiceItems.reduce((acc, item) => {
      const unitPrice = item.unitPrice || 0;
      const quantity = item.quantity || 0;
      return acc + unitPrice * quantity;
    }, 0);

    const discount = invoiceData.invoice.discount || 0;

    const vat = invoiceData.invoiceItems.reduce((acc, item) => {
      const unitPrice = item.unitPrice || 0;
      const quantity = item.quantity || 0;
      const vatPercent = item.vat || 0;
      const totalPrice = unitPrice * quantity;
      return acc + (totalPrice * vatPercent) / 100;
    }, 0);

    const received = invoiceData.invoice.receivedAmount || 0;

    const remaining = total_amount + vat - discount - received;

    const total_with_vat = total_amount + vat;

    // ==== Invoice object ====
    const invoiceDataToCreate = {
      invoice_no: invoiceData.invoice.invoiceNo,
      quotation_id: invoiceData.invoice.quotationNo,
      customer_id: invoiceData.customer.id || newCustomer.lastID,
      customer_trn: invoiceData.invoice.trn,
      project_name: invoiceData.invoice.projectName,
      total_amount,
      discount,
      vat,
      received,
      remaining,
      total_with_vat,
    };

    const newInvoice = await createInvoiceModel(db, invoiceDataToCreate);

    console.log(
      "New invoice: ",
      await getInvoiceByIdModel(db, newInvoice.lastID)
    );
    res.status(201).json({
      success: true,
      error: false,
      message: "Invoice created successfully",
      data: {
        invoiceId: newInvoice.lastID,
        customerId: invoiceData.customer.id || newCustomer.lastID,
      },
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

// Delete an invoice
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

//Delete invoice permanently
export const deleteInvoicePermanently = async (req, res) => {
  const { db } = req.app.locals;
  const { id } = req.params;
  try {
    const findInvoice = await getInvoiceByIdModel(db, id);

    if (!findInvoice) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Invoice not found",
      });
    }
    const { invoice, customer, invoice_items } = findInvoice;

    // Delete invoice items first
    await Promise.all(
      invoice_items.map((item) => {
        return db.run(`DELETE FROM invoice_items WHERE invoice_id=?`, [
          invoice.invoice_no,
        ]);
      })
    );

    await db.run(`DELETE FROM invoices WHERE id= ?`, [id]);
    return res.status(201).json({
      success: true,
      error: false,
      message: "Invoice Permanently Deleted.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message: "Internal server error",
    });
  }
};
// Restore an invoice
export const restoreInvoiceController = async (req, res) => {
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

    // Restore the invoice by setting is_deleted to 0
    const restorePurchase = await db.run(
      `UPDATE invoices SET is_deleted = 0 WHERE id = ?`,
      [id]
    );

    res.status(200).json({
      success: true,
      error: false,
      message: "Invoice restored successfully",
      data: restorePurchase,
    });
  } catch (error) {
    console.log("Error in restoreInvoiceController:", error);
    res.status(500).json({
      success: false,
      error: true,
      message: "Internal Server Error",
    });
  }
};

// Get search invoice
export const searchInvoiceController = async (req, res) => {
  const { db } = req.app.locals;
  const { search } = req.query;
  if (!search) {
    return res.status(400).json({
      success: false,
      error: true,
      message: "Search query is required",
    });
  }

  try {
    const invoice = await db.get(
      `SELECT * FROM invoices WHERE invoice_no = ?`,
      [search]
    );

    if (!invoice || invoice.length === 0) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "No invoice found",
      });
    }

    // Attach customer info to each invoice
    const customer = await getCustomerByIdModel(invoice.customer_id, db);

    const invoice_items = await db.all(
      `SELECT * FROM invoice_items WHERE invoice_id = ?`,
      [invoice.invoice_no]
    );

    res.status(200).json({
      success: true,
      error: false,
      message: "Invoices retrieved successfully",
      data: { ...invoice, customer, invoice_items },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: true,
      message: "Internal Server Error",
    });
  }
};

// Get invoice items by invoice number
export const getInvoiceItemByInvoicenoController = async (req, res) => {
  const { db } = req.app.locals;
  const { invoice_no } = req.params;
  if (!invoice_no) {
    return res.status(400).json({
      success: false,
      error: true,
      message: "Invoice number is required",
    });
  }
  try {
    const invoiceItems = await db.all(
      `SELECT * FROM invoice_items WHERE invoice_id = ?`,
      [invoice_no]
    );

    if (!invoiceItems || invoiceItems.length === 0) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "No invoice items found for this invoice",
      });
    }

    res.status(200).json({
      success: true,
      error: false,
      message: "Invoice items retrieved successfully",
      data: invoiceItems,
    });
  } catch (error) {
    console.log("Error in getInvoiceItemByInvoicenoController:", error);
    res.status(500).json({
      success: false,
      error: true,
      message: "Internal Server Error",
    });
  }
};

// Update invoice
export const updateInvoiceController = async (req, res) => {
  const { db } = req.app.locals;
  const { id } = req.params;
  const { invoice, items, customer } = req.body;

  try {
    // Validate existing invoice
    const existing = await getInvoiceByIdModel(db, id);
    if (!existing.invoice) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Invoice not found",
      });
    }

    // Optional: Update customer (if provided)
    if (customer?.id) {
      await db.run(
        `UPDATE customers SET name = ?, email = ?, phone = ?, address = ? WHERE id = ?`,
        [
          customer.name || "",
          customer.email || "",
          customer.phone || "",
          customer.address || "",
          customer.id,
        ]
      );
    }

    // Calculations
    const discount = invoice.discount || 0;
    const vat = items.reduce(
      (acc, item) =>
        acc +
        ((item.vat || 0) / 100) * (item.unit_price || 0) * (item.quantity || 0),
      0
    );

    const totalAmount =
      items.reduce(
        (acc, item) => acc + (item.unit_price || 0) * (item.quantity || 0),
        0
      ) - discount;

    const updatedInvoice = {
      invoice_no: invoice.invoice_no,
      quotation_id: invoice.quotation_id,
      customer_id: customer?.id || existing.invoice.customer_id,
      customer_trn: invoice.customer_trn,
      project_name: invoice.project_name,
      total_amount: totalAmount,
      discount,
      vat,
      received: invoice.received || 0,
    };

    console.log("updatedInvoice: ", updatedInvoice);
    // Update the invoice
    await db.run(
      `UPDATE invoices SET 
        invoice_no = ?, 
        quotation_id = ?, 
        customer_id = ?, 
        customer_trn = ?, 
        project_name = ?, 
        total_amount = ?, 
        discount = ?, 
        vat = ?, 
        received = ?
      WHERE id = ?`,
      [
        updatedInvoice.invoice_no,
        updatedInvoice.quotation_id,
        updatedInvoice.customer_id,
        updatedInvoice.customer_trn,
        updatedInvoice.project_name,
        updatedInvoice.total_amount,
        updatedInvoice.discount,
        updatedInvoice.vat,
        updatedInvoice.received,

        id,
      ]
    );

    // Get existing item IDs
    const existingItems = await db.all(
      `SELECT id FROM invoice_items WHERE invoice_id = ?`,
      [updatedInvoice.invoice_no]
    );

    const existingItemIds = existingItems.map((i) => i.id);

    const incomingItemIds = items.filter((i) => i.id).map((i) => i.id);

    // Delete removed items (optional)
    const deletedItems = existingItemIds.filter(
      (id) => !incomingItemIds.includes(id)
    );
    for (const itemId of deletedItems) {
      await db.run(`DELETE FROM invoice_items WHERE id = ?`, [itemId]);
    }

    // Update or insert items
    for (const item of items) {
      if (item.id) {
        // Update
        await db.run(
          `UPDATE invoice_items SET 
            description = ?, 
            quantity = ?, 
            unit_price = ?, 
            discount = ?, 
            vat = ? 
          WHERE id = ?`,
          [
            item.description,
            item.quantity,
            item.unit_price,
            item.discount,
            item.vat,
            item.id,
          ]
        );
      } else {
        // Insert
        await db.run(
          `INSERT INTO invoice_items 
            (invoice_id, description, quantity, unit_price, discount, vat) 
          VALUES (?, ?, ?, ?, ?, ?)`,
          [
            updatedInvoice.invoice_no,
            item.description,
            item.quantity,
            item.unit_price,
            item.discount,
            item.vat,
          ]
        );
      }
    }

    return res.status(200).json({
      success: true,
      message: "Invoice updated successfully",
    });
  } catch (error) {
    console.error("Error in updateInvoiceController:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//Sale Summary
export const summary = async (req, res) => {
  try {
    const { db } = req.app.locals;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Start date or end date is missing.",
      });
    }

    // Fetch invoices within the date range
    const sales = await db.all(
      `SELECT total_with_vat FROM invoices WHERE DATE(created_at) BETWEEN DATE(?) AND DATE(?)`,
      [startDate, endDate]
    );

    // Fetch all invoices to calculate lifetime total revenue
    const allInvoices = await db.all(`SELECT total_with_vat FROM invoices`);

    const totalSales =
      sales?.reduce((sum, inv) => sum + inv.total_with_vat, 0) || 0;
    const totalInvoices = sales?.length || 0;
    const totalRevenue =
      allInvoices?.reduce((sum, inv) => sum + inv.total_with_vat, 0) || 0;

    return res.status(200).json({
      success: true,
      error: false,
      message: "Sales summary retrieved successfully.",
      data: {
        totalSales,
        totalInvoices,
        totalRevenue,
      },
    });
  } catch (error) {
    console.error("Error in sales summary:", error);
    return res.status(500).json({
      success: false,
      error: true,
      message: "Internal server error.",
    });
  }
};
