//Get All quotation items
export const getAllQuotationItemsModel = (db) => {
  return db.all(`SELECT * FROM quotation_items`);
};

//get single quotation item
export const getSingleQuotationModel = (db, id) => {
  return db.get(`SELECT * FROM quotation_items WHERE id=?`, [id]);
};

//Create quotation item
export const createQuotationItemModel = (db, data) => {
  return db.run(
    `INSERT INTO quotation_items (quotation_id,description,size,quantity,unit_price) VALUES(?,?,?,?,?)`,
    [
      data.quotation_id,
      data.description,
      data.size,
      data.quantity,
      data.unit_price,
    ]
  );
};

//Update Quotation item
export const updateQuotationItemModel = (db, data, id) => {
  const fields = [];
  const values = [];

  for (const key in data) {
    fields.push(`${key} = ?`);
    values.push(data[key]);
  }

  if (fields.length === 0) Promise.resolve();

  const query = `UPDATE quotation_items SET ${fields.join(",")} WHERE id=?`;
  values.push(id);

  return db.run(query, values);
};
//Delete Quotation item
export const delteQuotationItemModel = (db, id) => {
  return db.run(`DELETE FROM quotation_items WHERE id=?`, [id]);
};
