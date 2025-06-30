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
} from "../models/invoice.model.js";
import { createInvoiceItemModel } from "../models/invoiceItem.model.js";

export const getAllInvoiceController = async (req, res) => {
  const { db } = req.app.locals;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    // Step 1: Get total count for pagination
    const totalCountResult = await db.get(
      `SELECT COUNT(*) as total FROM invoices WHERE is_deleted = 0`
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

export const createInvoiceController = async (req, res) => {
  const { db } = req.app.locals;
  const invoiceData = req.body;

  const { name, email, phone, address } = invoiceData.customer;
  try {
    let newCustomer;
    //check if customer exists
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
      // If customer ID is not provided, thats mean we need to create a new customer
      newCustomer = await createCustomerModel(db, name, email, phone, address);
    }

    // Now create the new invoiceItem
    const invoiceItems = invoiceData.invoiceItems.map((item) => {
      const data = {
        invoice_id: invoiceData.invoice.invoiceNo, // Assuming invoiceData has an id field
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        discount: item.discount,
        vat: item.vat,
      };
      return createInvoiceItemModel(db, data);
    });

    await Promise.all(invoiceItems);

    const invoiceDataToCreate = {
      invoice_no: invoiceData.invoice.invoiceNo, // Assuming invoiceData has an invoice field with invoiceNo
      quotation_id: invoiceData.invoice.quotationNo, // Assuming invoiceData has an quotation field with quotationNo
      customer_id: invoiceData.customer.id || newCustomer.lastID, // Assuming invoiceData has a customer field with id
      customer_trn: invoiceData.invoice.trn,
      project_name: invoiceData.invoice.projectName,
      total_amount: invoiceData.invoice.totalAmount,
      discount: invoiceData.invoiceItems.reduce(
        (acc, item) =>
          acc +
          ((item?.discount || 0) / 100) *
            (item?.unitPrice || 0) *
            (item?.quantity || 0),
        0
      ),
      vat: invoiceData.invoiceItems.reduce(
        (acc, item) =>
          acc +
          ((item?.vat || 0) / 100) *
            (item?.unitPrice || 0) *
            (item?.quantity || 0)
      ),
      received: invoiceData.invoice.receivedAmount,
    };

    const newInvoice = await createInvoiceModel(db, invoiceDataToCreate);

    res.status(201).json({
      success: true,
      error: false,
      message: "Invoice created successfully",
      data: {
        invoiceId: newInvoice.lastID, // Assuming createInvoiceModel returns the last inserted ID
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
    await db.run(`UPDATE invoices SET is_deleted = 0 WHERE id = ?`, [id]);

    res.status(200).json({
      success: true,
      error: false,
      message: "Invoice restored successfully",
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
