// Create a new Purchase
export const createPurchasesModel = (db, data) => {
  return db.run(
    `INSERT INTO purchases (purchase_no, supplier_name, description, total_amount, paid_amount, payment_status, remarks) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      data.purchase_no,
      data.supplier_name,
      data.description,
      data.total_amount,
      data.paid_amount,
      data.payment_status,
      data.remarks,
    ]
  );
};

//Get all purchases
export const getAllPurchasesModel = (db) => {
  return db.all(`SELECT * FROM purchases`);
};

//Get purchase By Id
export const getPurchaseByIDModel = (db, id) => {
  return db.get(`SELECT * FROM purchases WHERE id = ?`, [id]);
};

// delete purchase
export const deletePurchaseModel = (db, id) => {
  return db.run(`UPDATE purchases SET is_deleted = 1 WHERE id = ?`, [id]);
};

//Update purchase
export const updatePurchaseModel = (db, data, id) => {
  return db.run(
    `UPDATE purchases SET purchase_no = ?, supplier_name = ?, description = ?, total_amount=?, paid_amount=?,payment_status=?, remarks=? WHERE id = ?`,
    [
      data.purchase_no,
      data.supplier_name,
      data.description,
      data.total_amount,
      data.paid_amount,
      data.payment_status,
      data.remarks,
      id,
    ]
  );
};
