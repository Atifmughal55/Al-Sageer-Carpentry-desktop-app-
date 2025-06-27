// db/createTables.js

export const createTables = async (db) => {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      phone TEXT UNIQUE,
      address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  // await db.exec(`DROP TABLE IF EXISTS customers`);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS quotations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      quotation_no TEXT UNIQUE NOT NULL,
      customer_id INTEGER NOT NULL,
      project_name TEXT,
      status TEXT DEFAULT 'pending',
      valid_until DATE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers(id)
    );
  `);

  // await db.exec(`DROP TABLE IF EXISTS quotations`);
  await db.exec(`
    CREATE TABLE IF NOT EXISTS quotation_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      quotation_id INTEGER NOT NULL,
      description TEXT,
      size TEXT,
      quantity INTEGER,
      unit_price REAL,
      total_price AS (quantity * unit_price) STORED,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (quotation_id) REFERENCES quotations(id)
    );
  `);

  // await db.exec(`DROP TABLE IF EXISTS quotation_items`);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS invoices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invoice_no TEXT UNIQUE NOT NULL,
      quotation_id INTEGER,
      customer_id INTEGER NOT NULL,
      customer_trn TEXT,
      discount REAL DEFAULT 0,
      vat_percent REAL DEFAULT 5,
      total_amount REAL,
      total_vat REAL,
      total_with_vat REAL,
      net_amount REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (quotation_id) REFERENCES quotations(id),
      FOREIGN KEY (customer_id) REFERENCES customers(id)
    );
  `);
  await db.exec(`
    CREATE TABLE IF NOT EXISTS invoice_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invoice_id INTEGER NOT NULL,
      description TEXT,
      quantity INTEGER,
      unit_price REAL,
      vat REAL,
      vat_per_unit AS (unit_price * (vat / 100)) STORED,
      total_price AS (quantity * unit_price) STORED,
      total_amount_with_vat AS (total_price + quantity * vat_per_unit) STORED,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (invoice_id) REFERENCES invoices(id)
    );
  `);

  console.log("✅ All tables created successfully");
};
