import {
  createQuotationItemModel,
  delteQuotationItemModel,
  updateQuotationItemModel,
} from "./quotationItem.model.js";

//Get single Quotation
export const singleQuotationModel = async (db, id) => {
  //Get quotation
  const quotation = await db.get(`SELECT * FROM quotations WHERE id = ?`, [id]);

  if (!quotation) return { quotation: null };

  //Get customer by customer_id
  const customer = await db.get(`SELECT * FROM customers WHERE id = ?`, [
    quotation.customer_id,
  ]);

  //Get quotation_items against this quotation
  const quotation_items = await db.all(
    `SELECT * FROM quotation_items WHERE quotation_id = ? `,
    [id]
  );

  return { quotation, customer, quotation_items };
};

//Get all quotations
export const allQuotations = (db) => {
  return db.all(`SELECT * FROM quotations`);
};

//Get Quotations against a customers
export const allQuotationsWithCustomerModel = async (db) => {
  return await db.all(`
      SELECT q.*, c.name AS customer_name
      FROM quotations q
      JOIN customers c ON q.customer_id = c.id
      ORDER BY q.created_at DESC
    `);
};

//Create new quotation
export const createQuotationModel = async (db, data) => {
  return db.run(
    `INSERT INTO quotations (quotation_no, customer_id, project_name, valid_until) VALUES (?, ?, ?, ?)`,
    [data.quotationNo, data.customerId, data.projectName, data.valid]
  );
};

//Delete quotation
export const deleteQuotationModel = async (db, id) => {
  return db.run(`DELETE FROM quotations WHERE id = ?`, [id]);
};

//Update quotation
export const updateQuotationModel = async (db, payload, id) => {
  const { project_name, quotation_items = [], deleted_item_ids = [] } = payload;

  try {
    // 1. Update project name
    if (project_name) {
      await db.run(`UPDATE quotations SET project_name = ? WHERE id = ?`, [
        project_name,
        id,
      ]);
    }

    // 2. Delete quotation items if any
    if (deleted_item_ids.length > 0) {
      for (const itemId of deleted_item_ids) {
        await delteQuotationItemModel(db, itemId);
      }
    }

    // 3. Add or update quotation items
    for (const item of quotation_items) {
      if (item.id) {
        // Existing item - update
        await updateQuotationItemModel(db, item, item.id);
      } else {
        // New item - add
        await createQuotationItemModel(db, {
          ...item,
          quotation_id: id,
        });
      }
    }

    return { success: true, message: "Quotation updated successfully." };
  } catch (error) {
    console.error("Error updating quotation:", error);
    return { success: false, message: "Failed to update quotation.", error };
  }
};
