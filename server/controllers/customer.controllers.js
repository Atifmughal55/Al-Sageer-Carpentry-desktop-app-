import {
  createCustomerModel,
  deleteCustomerModel,
  getAllCustomersModel,
  getCustomerByFieldsModel,
  getCustomerByIdModel,
  updateCustomerModel,
} from "../models/customer.model.js";

//Get All Customers
export const getAllCustomers = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const customers = await getAllCustomersModel(db);
    res.status(200).json({
      success: true,
      error: false,
      message: "Customers fetched successfully",
      totalCustomer: customers.length,
      data: customers,
    });
  } catch (error) {
    console.log("Error fetching customers: ", error || error.message);
    return res.status(500).json({
      error: true,
      success: false,
      message: "Something went wrong while fetching customers",
    });
  }
};

//Get Custoemer By ID
export const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const db = req.app.locals.db;
    const customer = await getCustomerByIdModel(id, db);
    if (!customer) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Customer not found",
      });
    }

    return res.status(200).json({
      success: false,
      error: true,
      message: "Fetched Customer successfully",
      data: customer,
    });
  } catch (error) {
    console.log("Erron while getting customers: ", error);
    return res.status(500).json({
      success: false,
      error: true,
      message: "Error while getting customers",
    });
  }
};

//Add A New Customer
export const addNewCustomer = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { name, email, phone, address } = req.body;
    if (!name || !email || !phone || !address) {
      return res.status(401).json({
        success: false,
        error: true,
        message: "Some fields are missing, Please try again",
      });
    }

    const newCustomer = await createCustomerModel(
      db,
      name,
      email,
      phone,
      address
    );

    const createdCustomer = await getCustomerByIdModel(newCustomer.lastID, db);
    return res.status(200).json({
      success: true,
      error: false,
      message: "Customer created successfully",
      data: createdCustomer,
    });
  } catch (error) {
    console.log("Error while adding new customer.", error);
    return res.status(500).json({
      success: false,
      error: true,
      message: "Something went wrong while adding new Customer",
    });
  }
};

//Update A Customer
export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const db = req.app.locals.db;
    const { name, email, phone, address } = req.body;

    // Filter only non-undefined fields
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update",
      });
    }

    await updateCustomerModel(id, db, updateData);
    const getUpdatedCustomer = await getCustomerByIdModel(id, db);

    return res.status(200).json({
      success: true,
      error: false,
      message: "Customer updated successfully",
      data: getUpdatedCustomer,
    });
  } catch (error) {
    console.log("Error while updating customer: ", error);
    return res.status(500).json({
      success: false,
      error: true,
      message: "Something went wrong while updating customer",
    });
  }
};

//Delete customer
export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const db = req.app.locals.db;

    if (!id) {
      return res.status(402).json({
        success: false,
        error: true,
        message: "Please provide customer ID",
      });
    }

    const customer = await getCustomerByIdModel(id, db);
    if (!customer) {
      return res.status(402).json({
        success: false,
        error: true,
        message: "No Customer found",
      });
    }

    await deleteCustomerModel(customer.id, db);
    res.status(200).json({
      success: true,
      error: false,
      message: "Customer deleted successfully",
    });
  } catch (error) {
    console.log("Error while deleting customer");
    return res.status(500).json({
      success: false,
      error: true,
      message: "Something went wrong while deteling customer",
    });
  }
};

export const searchCustomer = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { email, phone } = req.query;

    // Ensure at least one value is provided

    if (!email && !phone) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Please provide either email or phone number to search.",
      });
    }
    const data = { email, phone };
    const customer = await getCustomerByFieldsModel(db, data);
    if (!customer) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "No customer found with the provided email or phone number.",
      });
    }
    // If customer is found, return the customer data
    return res.status(200).json({
      success: true,
      error: false,
      message: "Fetched results",
      data: customer,
    });
  } catch (error) {
    console.log("Error while getting customer: ", error || error.message);
    return res.status(500).json({
      success: false,
      error: true,
      message: "Internal Server Error",
    });
  }
};
