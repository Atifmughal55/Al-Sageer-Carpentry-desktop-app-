//Get all invoices with pagination
export const getAllInvoiceModel = (db, limit, offset) => {
  return db.all(`SELECT * FROM invoices LIMIT ? OFFSET ?`, [limit, offset]);
};

// Get invoice by ID
export const getInvoiceByIdModel = async (db, id) => {
  // Get invoice
  const invoice = await db.get(`SELECT * FROM invoices WHERE id = ?`, [id]);

  if (!invoice) return { invoice: null };

  // Get customer by customer_id
  const customer = await db.get(`SELECT * FROM customers WHERE id = ?`, [
    invoice.customer_id,
  ]);

  // Get invoice_items against this invoice
  const invoice_items = await db.all(
    `SELECT * FROM invoice_items WHERE invoice_id = ? `,
    [id]
  );

  return { invoice, customer, invoice_items };
};

// create a new invoice
export const createInvoiceModel = async (db, invoiceData) => {
  const {
    invoice_no,
    quotation_id,
    customer_id,
    customer_trn,
    project_name,
    total_amount,
    discount,
    received,
  } = invoiceData;
  return db.run(
    `INSERT INTO invoices ( invoice_no,quotation_id,customer_id,customer_trn,project_name,total_amount,discount,received ) VALUES (?, ?, ?, ?,?,?,?,?)`,
    [
      invoice_no,
      quotation_id,
      customer_id,
      customer_trn,
      project_name,
      total_amount,
      discount,
      received,
    ]
  );
};

//Delete an invoice by ID
export const deleteInvoiceModel = async (db, id) => {
  // Delete invoice items first
  await db.run(`DELETE FROM invoice_items WHERE invoice_id = ?`, [id]);

  // Then delete the invoice
  return db.run(`DELETE FROM invoices WHERE id = ?`, [id]);
};
