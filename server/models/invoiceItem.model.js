//Get all invoice items
export const getAllInvoiceItemsModel = (db) => {
  return db.all(`SELECT * FROM invoice_items`);
};

//Get single invoice item
export const getSingleInvoiceItemModel = (db, id) => {
  return db.get(`SELECT * FROM invoice_items WHERE id = ?`, [id]);
};

//create new invoice item
export const createInvoiceItemModel = (db, data) => {
  return db.run(
    `INSERT INTO invoice_items (invoice_id, description, quantity, unit_price, vat)
     VALUES (?, ?, ?, ?, ?)`,
    [
      data.invoice_id,
      data.description,
      data.quantity,
      data.unit_price,
      data.vat,
    ]
  );
};

//Update an invoice item
export const updateInvoiceItemModel = (db, data, id) => {
  const fields = [];
  const values = [];

  for (const key in data) {
    fields.push(`${key} = ?`);
    values.push(data[key]);
  }

  if (fields.length === 0) {
    Promise.resolve();
  }
  const query = `UPDATE invoice_items SET ${fields.join(",")} WHERE id = ?`;
  values.push(id);

  return db.run(query, values);
};
//Delete an invoice item
export const deleteInvoiceItemModel = (db, id) => {
  return db.run(`DELETE FROM invoice_items WHERE id = ?`, [id]);
};
