import {
  createPurchasesModel,
  deletePurchaseModel,
  getAllPurchasesModel,
  getPurchaseByIDModel,
  updatePurchaseModel,
} from "../models/purchases.model.js";

export const createNewPurchaseController = async (req, res) => {
  const { db } = req.app.locals;
  const {
    purchase_no,
    supplier_name,
    description,
    total_amount,
    paid_amount,
    payment_status,
    remarks,
  } = req.body;
  if (
    !purchase_no ||
    !supplier_name ||
    !description ||
    !total_amount ||
    !paid_amount ||
    !payment_status ||
    !remarks
  ) {
    return res.status(400).json({
      success: false,
      error: true,
      message: "Some fields are missing",
    });
  }

  const purchases = await getAllPurchasesModel(db);

  const existingPurchase = purchases.find((p) => p.purchase_no === purchase_no);

  if (existingPurchase) {
    return res.status(402).json({
      success: false,
      error: true,
      message: "Purchase no should be unique",
    });
  }

  try {
    const data = {
      purchase_no,
      supplier_name,
      description,
      total_amount,
      paid_amount,
      payment_status,
      remarks,
    };

    const newPurchase = await createPurchasesModel(db, data);

    const createdPurchase = await getPurchaseByIDModel(db, newPurchase.lastID);
    return res.status(201).json({
      success: true,
      error: false,
      message: "Purchase created successfully",
      data: createdPurchase,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message: "Internal server error",
    });
  }
};

export const getAllPurchasesController = async (req, res) => {
  try {
    const { db } = req.app.locals;

    if (!db) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Something went wrong",
      });
    }

    const allPurchases = await getAllPurchasesModel(db);

    return res.status(200).json({
      success: true,
      error: false,
      message: "fetched all purchases",
      totalPurchases: allPurchases.length,
      data: allPurchases,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message: "Internal server error",
    });
  }
};

export const getPurchaseByIDController = async (req, res) => {
  const { db } = req.app.locals;
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(401).json({
        success: false,
        error: true,
        message: "Id not provided",
      });
    }

    const purchase = await getPurchaseByIDModel(db, id);
    if (!purchase) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Purchase not found",
      });
    }

    return res.status(200).json({
      success: true,
      error: false,
      message: "Purchase fetched successfully",
      data: purchase,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message: "Internal server error",
    });
  }
};

//getPurchaseBY P-No
export const getPurchaseByPurchaseNoController = async (req, res) => {
  try {
    const { db } = req.app.locals;
    const { purchaseNo } = req.params;

    const purchase = await db.get(
      `SELECT * FROM purchases WHERE purchase_no = ?`,
      [purchaseNo]
    );

    if (!purchase) {
      return res.status(404).json({
        success: false,
        error: true,
        success: "Purchase not found",
      });
    }

    return res.status(200).json({
      success: true,
      error: false,
      data: purchase,
      message: "Purchase found successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message: "Internal server error",
    });
  }
};

export const deletePurchaseController = async (req, res) => {
  const { db } = req.app.locals;
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(401).json({
        success: false,
        error: true,
        message: "Something went wrong",
      });
    }

    const purchase = await getPurchaseByIDModel(db, id);
    if (!purchase) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Purchase not found",
      });
    }

    await deletePurchaseModel(db, id);

    return res.status(200).json({
      success: true,
      error: false,
      message: "Purchase deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message: "Internal server error",
    });
  }
};

//recover deleted Purchases
export const recoverDeletedPurchases = async (req, res) => {
  try {
    const { db } = req.app.locals;
    const { id } = req.params;
    if (!id) {
      return res.status(401).json({
        success: false,
        error: true,
        message: "Something went wrong",
      });
    }

    const purchase = await getPurchaseByIDModel(db, id);
    if (!purchase) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Purchase not found",
      });
    }

    const recoverPurchase = await db.run(
      `UPDATE purchases SET is_deleted=0 where id = ?`,
      [id]
    );

    return res.status(201).json({
      success: true,
      error: false,
      message: "Purchase recover successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message: "Internal server error",
    });
  }
};

export const updatePurchaseController = async (req, res) => {
  const { db } = req.app.locals;
  const { id } = req.params;
  const {
    purchase_no,
    supplier_name,
    description,
    total_amount,
    paid_amount,
    payment_status,
    remarks,
  } = req.body;

  try {
    if (!id) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Invalid purchase ID",
      });
    }

    const purchase = await getPurchaseByIDModel(db, id);
    if (!purchase) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Purchase not found",
      });
    }

    const data = {
      purchase_no,
      supplier_name,
      description,
      total_amount,
      paid_amount,
      payment_status,
      remarks,
    };

    await updatePurchaseModel(db, data, id);

    return res.status(200).json({
      success: true,
      error: false,
      message: "Purchase updated successfully",
      updated: data, // optional: send updated values back
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message: "Internal server error",
    });
  }
};

//permanently Deleted Purchase
export const permanentlyDeletePurchaseController = async (req, res) => {
  try {
    const { db } = req.app.locals;
    const { id } = req.params;

    const purchase = await getPurchaseByIDModel(db, id);
    if (!purchase) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Purchase not found",
      });
    }

    await db.run(`DELETE FROM purchases WHERE id = ?`, [id]);
    return res.status(200).json({
      success: true,
      error: false,
      message: "Purchase permanently deleted",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message: "Internal server error",
    });
  }
};
