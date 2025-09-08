// Get all Walk-in Customers
export const getAllWalkInCustomersModel = (db) => {
  return db.all(`SELECT * FROM walkIn_customers`);
};

// Get Walk-in Customer by ID
export const getWalkInCustomerByIdModel = (id, db) => {
  return db.get(`SELECT * FROM walkIn_customers WHERE id = ?`, [id]);
};

// Create new Walk-in Customer
export const createWalkInCustomerModel = (
  db,
  name,
  phone,
  items,
  grand_total,
  discount,
  after_discount,
  balance,
  received,
  status = "unpaid"
) => {
  return db.run(
    `INSERT INTO walkIn_customers 
    (name, phone, items, grand_total, discount,after_discount, balance, received, status) 
   VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)`,
    [
      name,
      phone,
      JSON.stringify(items),
      grand_total,
      discount,
      after_discount,
      balance,
      received,
      status,
    ]
  );
};

// Update a Walk-in Customer
export const updateWalkInCustomerModel = (id, db, data) => {
  const fields = [];
  const values = [];

  for (const key in data) {
    // stringify JSON if items are being updated
    if (key === "items") {
      fields.push(`${key} = ?`);
      values.push(JSON.stringify(data[key]));
    } else {
      fields.push(`${key} = ?`);
      values.push(data[key]);
    }
  }

  if (fields.length === 0) return Promise.resolve(); // nothing to update

  const query = `UPDATE walkIn_customers SET ${fields.join(", ")} WHERE id = ?`;
  values.push(id);

  return db.run(query, values);
};

// Delete a Walk-in Customer
export const deleteWalkInCustomerModel = (id, db) => {
  return db.run(`DELETE FROM walkIn_customers WHERE id = ?`, [id]);
};
