import {
  createWalkInCustomerModel,
  deleteWalkInCustomerModel,
  getAllWalkInCustomersModel,
  getWalkInCustomerByIdModel,
  updateWalkInCustomerModel,
} from "../models/walkInCustomer.model.js";

// Get All Walk-in Customers
export const getAllWalkInCustomers = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const customers = await getAllWalkInCustomersModel(db);

    // Parse JSON items before sending
    const parsedCustomers = customers.map((c) => ({
      ...c,
      items: c.items ? JSON.parse(c.items) : [],
    }));

    res.status(200).json({
      success: true,
      error: false,
      message: "Walk-in customers fetched successfully",
      totalCustomer: parsedCustomers.length,
      data: parsedCustomers,
    });
  } catch (error) {
    console.log("Error fetching walk-in customers: ", error || error.message);
    return res.status(500).json({
      error: true,
      success: false,
      message: "Something went wrong while fetching walk-in customers",
    });
  }
};

// Get Walk-in Customer By ID
export const getWalkInCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const db = req.app.locals.db;
    const customer = await getWalkInCustomerByIdModel(id, db);
    if (!customer) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Walk-in customer not found",
      });
    }

    return res.status(200).json({
      success: true,
      error: false,
      message: "Fetched Walk-in customer successfully",
      data: {
        ...customer,
        items: customer.items ? JSON.parse(customer.items) : [],
      },
    });
  } catch (error) {
    console.log("Error while getting walk-in customer: ", error);
    return res.status(500).json({
      success: false,
      error: true,
      message: "Error while getting walk-in customer",
    });
  }
};

// Add A New Walk-in Customer
export const addNewWalkInCustomer = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { name, phone, items, discount = 0, received = 0 } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Items are required and should be an array",
      });
    }

    // Calculate totals
    const total = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const grand_total = total;
    const after_discount = grand_total - discount;
    const balance = after_discount - received;

    // Determine payment status
    const paymentStatus =
      received >= after_discount ? "paid" : received > 0 ? "partial" : "unpaid";

    // Save customer
    const newCustomer = await createWalkInCustomerModel(
      db,
      name || "WalkIn Customer",
      phone || null,
      items,
      grand_total,
      discount,
      after_discount,
      balance,
      received,
      paymentStatus
    );

    const createdCustomer = await getWalkInCustomerByIdModel(
      newCustomer.lastID,
      db
    );

    return res.status(200).json({
      success: true,
      error: false,
      message: "Walk-in customer created successfully",
      data: {
        ...createdCustomer,
        items: createdCustomer.items ? JSON.parse(createdCustomer.items) : [],
      },
    });
  } catch (error) {
    console.log("Error while adding new walk-in customer.", error);
    return res.status(500).json({
      success: false,
      error: true,
      message: "Something went wrong while adding new Walk-in Customer",
    });
  }
};

// Update A Walk-in Customer
export const updateWalkInCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const db = req.app.locals.db;
    const { name, phone, items, discount, status } = req.body;

    // Filter only non-undefined fields
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (items !== undefined) updateData.items = items; // handled in model (stringify)
    if (status !== undefined) updateData.status = status;
    if (discount !== undefined) updateData.discount = discount;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update",
      });
    }

    await updateWalkInCustomerModel(id, db, updateData);
    const getUpdatedCustomer = await getWalkInCustomerByIdModel(id, db);

    return res.status(200).json({
      success: true,
      error: false,
      message: "Walk-in customer updated successfully",
      data: {
        ...getUpdatedCustomer,
        items: getUpdatedCustomer.items
          ? JSON.parse(getUpdatedCustomer.items)
          : [],
      },
    });
  } catch (error) {
    console.log("Error while updating walk-in customer: ", error);
    return res.status(500).json({
      success: false,
      error: true,
      message: "Something went wrong while updating walk-in customer",
    });
  }
};

// Delete Walk-in customer
export const deleteWalkInCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const db = req.app.locals.db;

    if (!id) {
      return res.status(402).json({
        success: false,
        error: true,
        message: "Please provide walk-in customer ID",
      });
    }

    const customer = await getWalkInCustomerByIdModel(id, db);
    if (!customer) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "No Walk-in Customer found",
      });
    }

    await deleteWalkInCustomerModel(customer.id, db);
    res.status(200).json({
      success: true,
      error: false,
      message: "Walk-in customer deleted successfully",
    });
  } catch (error) {
    console.log("Error while deleting walk-in customer", error);
    return res.status(500).json({
      success: false,
      error: true,
      message: "Something went wrong while deleting walk-in customer",
    });
  }
};
