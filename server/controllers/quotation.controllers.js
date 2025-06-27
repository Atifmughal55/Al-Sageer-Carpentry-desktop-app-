import { getQuotationByNumber } from "../models/quotation.model.js"; // adjust the path
import {
  createCustomerModel,
  getCustomerByFieldsModel,
  getCustomerByIdModel,
} from "../models/customer.model.js";
import {
  allQuotations,
  allQuotationsWithCustomerModel,
  createQuotationModel,
  deleteQuotationModel,
  singleQuotationModel,
  updateQuotationModel,
} from "../models/quotation.model.js";
import { createQuotationItemModel } from "../models/quotationItem.model.js";
import { generateQuotationNo } from "../utils/generateId.js";

export const getQuotation = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { id } = req.params;

    const { quotation, customer, quotation_items } = await singleQuotationModel(
      db,
      id
    );

    if (!quotation) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Quotation Not found",
      });
    }

    //Calculate total amount
    const total_amount = quotation_items.reduce(
      (sum, item) => sum + item.total_price,
      0
    );
    return res.status(200).json({
      success: true,
      error: false,
      message: "Quotation fetched successfully",
      data: {
        ...quotation,
        customer,
        quotation_items,
        totalItems: quotation_items.length,
        totalAmount: total_amount,
      },
    });
  } catch (error) {
    console.log("Error while getting quotation: ", error || error.message);
    return res.status(500).json({
      success: false,
      error: true,
      message: "Internal server error",
    });
  }
};

export const getAllQuotations = async (req, res) => {
  try {
    const db = req.app.locals.db;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    // Get all quotations
    const quotations = await allQuotations(db, limit, offset);

    // For each quotation, fetch its customer using customer_id
    const quotationsWithCustomer = await Promise.all(
      quotations.map(async (quotation) => {
        const customer = await getCustomerByIdModel(quotation.customer_id, db);
        return {
          ...quotation,
          customer, // add customer info under a separate key
        };
      })
    );

    return res.status(200).json({
      success: true,
      error: false,
      page: page,
      offset: offset,
      limit: limit,
      message: "Fetched all the quotations.",
      total_quotations: quotationsWithCustomer.length,
      data: quotationsWithCustomer,
    });
  } catch (error) {
    console.log("Error while fetching quotations: ", error || error.message);
    return res.status(500).json({
      success: false,
      error: true,
      message: "Internal server error",
    });
  }
};

export const getQuotationByNo = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { quotation_no } = req.params;

    const quotation = await getQuotationByNumber(db, quotation_no);

    if (quotation) {
      const customer = await getCustomerByIdModel(quotation.customer_id, db);
      const payload = {
        quotation: quotation,
        customer: customer,
      };
      return res.status(200).json({
        success: true,
        data: payload,
        message: "Quotation fetched successfully.",
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Quotation not found.",
      });
    }
  } catch (error) {
    console.error("Error fetching quotation:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

export const getQuotationsWithCustomer = async (req, res) => {
  try {
    const db = req.app.locals.db;

    const quotations = await allQuotationsWithCustomerModel(db);

    return res.status(200).json({
      success: true,
      error: false,
      message: "Fetched all the quotations.",
      total_quotations: quotations.length,
      data: quotations,
    });
  } catch (error) {
    console.log("Error while fetching quotations: ", error || error.message);
    return res.status(500).json({
      success: false,
      error: true,
      message: "Internal server error",
    });
  }
};

export const createQuotation = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { customer, quotation, items } = req.body;

    if (!customer || !quotation || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "All the fields are required",
      });
    }

    const { name, phone, email, address, trn } = customer;

    // Check if customer already exists (by email or phone)
    const data = { email, phone };

    // let existingCustomer = await getCustomerByIdModel(6, db);
    let existingCustomer = await getCustomerByFieldsModel(db, data);

    let customerId;

    if (existingCustomer) {
      // Use existing customer ID
      customerId = existingCustomer.id;
    } else {
      // Insert new customer
      const insertCustomer = await createCustomerModel(
        db,
        name,
        email,
        phone,
        address,
        trn
      );
      customerId = insertCustomer.lastID;
    }

    // Generate quotation number
    const quotationNo = generateQuotationNo();

    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 15);

    const quotationData = {
      quotationNo,
      customerId,
      projectName: quotation.project_name,
      valid: validUntil.toISOString().slice(0, 10),
    };

    // Insert Quotation
    const quotationResult = await createQuotationModel(db, quotationData);
    const quotationId = quotationResult.lastID;

    // Insert Quotation items
    const insertItemPromises = items.map((item) => {
      const data = {
        quotation_id: quotationId,
        description: item.description,
        size: item.size,
        quantity: item.quantity,
        unit_price: item.unit_price,
      };
      return createQuotationItemModel(db, data);
    });

    await Promise.all(insertItemPromises);

    // Response
    return res.status(201).json({
      success: true,
      error: false,
      message: "Quotation created successfully",
      data: {
        quotation_id: quotationId,
        quotationNo: quotationNo,
      },
    });
  } catch (error) {
    console.error("Error while creating quotation:", error);
    return res.status(500).json({
      success: false,
      error: true,
      message: "Internal server error",
    });
  }
};

export const deleteQuotatoin = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { id } = req.params;

    if (!id) {
      return res.status(402).json({
        success: false,
        error: true,
        message: "Please provide ID",
      });
    }

    const { quotation, customer, quotation_items } = await singleQuotationModel(
      db,
      id
    );

    if (!quotation) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Quotation not found",
      });
    }

    await Promise.all(
      quotation_items.map((item) => {
        return db.run(`DELETE FROM quotation_items WHERE id = ?`, [item.id]);
      })
    );
    // Delete the quotation
    await deleteQuotationModel(db, id);

    // Optionally, you can also delete the customer if no other quotations exist for that customer
    const customerExists = await db.get(
      `SELECT COUNT(*) as count FROM quotations WHERE customer_id = ?`,
      [quotation.customer_id]
    );
    if (customerExists.count === 0) {
      await db.run(`DELETE FROM customers WHERE id = ?`, [
        quotation.customer_id,
      ]);
    }
    return res.status(200).json({
      success: true,
      error: false,
      message: "Quotation Deleted Successfully",
    });
  } catch (error) {
    console.log("Error while deleting quotation: ", error || error.message);
    return res.status(500).json({
      success: false,
      error: true,
      message: "Internal server error",
    });
  }
};

export const updateQuotation = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { id } = req.params;
    const payload = req.body;

    console.log("payload: ", payload);
    const result = await updateQuotationModel(db, payload, id);

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } else {
      return res.status(500).json({
        success: false,
        message: result.message,
        error: result.error,
      });
    }
  } catch (error) {
    console.error("Controller error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error,
    });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { id } = req.params; // quotation ID from URL
    const { status } = req.body; // new status from body

    if (!status) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Status is required",
      });
    }

    const result = await db.run(
      `UPDATE quotations SET status = ? WHERE id = ?`,
      [status, id]
    );

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Quotation not found",
      });
    }

    return res.status(200).json({
      success: true,
      error: false,
      message: "Quotation status updated successfully",
    });
  } catch (error) {
    console.log("Error while updating status: ", error.message || error);
    return res.status(500).json({
      success: false,
      error: true,
      message: "Internal server error",
    });
  }
};
