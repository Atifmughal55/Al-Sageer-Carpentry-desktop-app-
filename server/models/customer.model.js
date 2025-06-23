//Get all customers
export const getAllCustomersModel = (db) => {
  return db.all(`SELECT * FROM customers`);
};

//Get customer by ID
export const getCustomerByIdModel = (id, db) => {
  return db.get(`SELECT * FROM customers WHERE id = ?`, [id]);
};

//Create new Customer
export const createCustomerModel = (db, name, email, phone, address) => {
  return db.run(
    `INSERT INTO customers (name,email,phone,address) VALUES (?,?,?,?)`,
    [name, email, phone, address]
  );
};

//Update a Customer
export const updateCustomerModel = (id, db, data) => {
  const fields = [];
  const values = [];

  for (const key in data) {
    fields.push(`${key} = ?`);
    values.push(data[key]);
  }

  if (fields.length === 0) return Promise.resolve(); // nothing to update

  const query = `UPDATE customers SET ${fields.join(", ")} WHERE id = ?`;
  values.push(id); // `id` goes last

  return db.run(query, values);
};

//Delete a Customer
export const deleteCustomerModel = (id, db) => {
  return db.run(`DELETE FROM customers WHERE id = ?`, [id]);
};

export const getCustomerByFieldsModel = (db, data) => {
  return db.get(`SELECT * FROM customers WHERE email = ? OR phone = ?`, [
    data.email,
    data.phone,
  ]);
};
