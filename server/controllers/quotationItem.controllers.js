import {
  createQuotationItemModel,
  delteQuotationItemModel,
  getAllQuotationItemsModel,
  getSingleQuotationModel,
  updateQuotationItemModel,
} from "../models/quotationItem.model.js";

export const getAllQuotationItems = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const quotationItems = await getAllQuotationItemsModel(db);

    return res.status(200).json({
      success: true,
      error: false,
      message: "Quotation fetched successfully",
      totalItems: quotationItems.length,
      data: quotationItems,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message: "Something went wrong while fetching quotation items",
    });
  }
};

export const getQuotationItem = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { id } = req.params;

    const quotaionItem = await getSingleQuotationModel(db, id);
    if (!quotaionItem) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Quotation not found",
      });
    }

    return res.status(200).json({
      success: true,
      error: false,
      message: "Fetch Quotation item successfully",
      data: quotaionItem,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message: "Something went wrong while fetching quotation",
    });
  }
};

export const createQuotaitonItem = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { quotation_id, description, size, quantity, unit_price } = req.body;

    if (!quotation_id || !description || !size || !quantity || !unit_price) {
      return res.status(202).json({
        success: false,
        error: true,
        message: "All Fields are required",
      });
    }

    const quotationData = {};
    if (quotation_id !== undefined) quotationData.quotation_id = quotation_id;
    if (description !== undefined) quotationData.description = description;
    if (size !== undefined) quotationData.size = size;
    if (quantity !== undefined) quotationData.quantity = quantity;
    if (unit_price !== undefined) quotationData.unit_price = unit_price;

    const newQuotationItem = await createQuotationItemModel(db, quotationData);

    const insertedQuotationItem = await getSingleQuotationModel(
      db,
      newQuotationItem.lastID
    );

    return res.status(201).json({
      success: true,
      error: false,
      message: "Quotation item created successfully",
      data: insertedQuotationItem,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message: "Something went wrong while creating new Quotaion item",
    });
  }
};

export const updateQuotationItem = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { id } = req.params;
    const { quotation_id, description, size, quantity, unit_price } = req.body;
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Invalid item ID",
      });
    }

    const checkItem = await getSingleQuotationModel(db, id);
    if (!checkItem) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Quotaion item not found",
      });
    }

    const updateData = {};

    if (quotation_id !== undefined) updateData.quotation_id = quotation_id;
    if (description !== undefined) updateData.description = description;
    if (size !== undefined) updateData.size = size;
    if (quantity !== undefined) updateData.quantity = quantity;
    if (unit_price !== undefined) updateData.unit_price = unit_price;

    if (Object.keys(updateData).length === 0) {
      return res.status(201).json({
        success: false,
        error: true,
        message: "No fields to update",
      });
    }

    await updateQuotationItemModel(db, updateData, id);
    const updatedItem = await getSingleQuotationModel(db, id);

    return res.status(200).json({
      success: true,
      error: false,
      message: "Quotation item updated successfully",
      data: updatedItem,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message: "Something went wrong while updating quotation item",
    });
  }
};

export const deleteQuotationItem = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { id } = req.params;

    const findItem = await getSingleQuotationModel(db, id);
    if (!findItem) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Quotation item not found",
      });
    }

    await delteQuotationItemModel(db, id);
    return res.status(200).json({
      success: true,
      error: false,
      message: "Quotation item deleted.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message: "Something went wrong while deleting quotation item",
    });
  }
};

export const getAllQuotationsWithQuotNo = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { qtno } = req.params;
    if (!qtno) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Please provide quotation no",
      });
    }

    const quotation_Items = await db.all(
      `SELECT * FROM quotation_items WHERE quotation_id = ?`,
      [qtno]
    );

    return res.status(200).json({
      success: true,
      error: false,
      message: "Fetched all the quotations.",
      data: quotation_Items,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message: "Internal server error",
    });
  }
};
