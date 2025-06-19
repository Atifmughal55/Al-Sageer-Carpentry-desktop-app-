// db/createTables.js

export const createTables = async (db) => {
  await db.exec(`
      CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE ,
        phone TEXT UNIQUE,
        address TEXT
      );
    `);

  await db.exec(`
      CREATE TABLE IF NOT EXISTS quotations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        quotation_no TEXT UNIQUE NOT NULL,
        customer_id INTEGER NOT NULL,
        project_name TEXT,
        status TEXT DEFAULT 'pending', -- or 'approved'
        created_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY(customer_id) REFERENCES customers(id)
      );
    `);

  await db.exec(`
      CREATE TABLE IF NOT EXISTS invoices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  invoice_no TEXT UNIQUE NOT NULL,
  customer_id INTEGER NOT NULL,
  quotation_id INTEGER NOT NULL,
  total_amount REAL NOT NULL,            
  total_vat REAL NOT NULL,               
  total_with_vat REAL NOT NULL,          
  date TEXT DEFAULT (datetime('now')),
  FOREIGN KEY(customer_id) REFERENCES customers(id),
  FOREIGN KEY(quotation_id) REFERENCES quotations(id)
  )`);

  await db.exec(`CREATE TABLE IF NOT EXISTS invoice_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  invoice_id INTEGER NOT NULL,
  description TEXT NOT NULL,             
  quantity INTEGER NOT NULL,
  unit_price REAL NOT NULL,
  unit_vat REAL NOT NULL,                
  total_price REAL NOT NULL,             
  total_vat REAL NOT NULL,               
  total_with_vat REAL NOT NULL,          
  FOREIGN KEY(invoice_id) REFERENCES invoices(id)
);
`);
  console.log("✅ All tables created successfully");
};
