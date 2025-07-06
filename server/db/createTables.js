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
      quotation_id TEXT,
      customer_id INTEGER NOT NULL,
      customer_trn TEXT,
      project_name TEXT,
      total_amount REAL,
      is_deleted INTEGER DEFAULT 0, -- 👈 Correct way to set boolean-like field
      discount REAL DEFAULT 0,
      vat REAL DEFAULT 0,
      total_with_vat REAL AS (total_amount + vat - discount) STORED,
      received REAL DEFAULT 0,
      remaining REAL AS (total_with_vat - received) STORED,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (quotation_id) REFERENCES quotations(id),
      FOREIGN KEY (customer_id) REFERENCES customers(id)
    );
  `);

  // await db.exec(`DROP TABLE IF EXISTS invoices`);
  await db.exec(`
      CREATE TABLE IF NOT EXISTS invoice_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_id TEXT NOT NULL,
    description TEXT,
    quantity INTEGER,
    unit_price REAL,
    discount REAL DEFAULT 0,          -- percentage (e.g., 10 for 10%)
    vat REAL DEFAULT 5,              -- percentage (e.g., 5 for 5%)
    net_unit_price AS (
      unit_price * (1 - discount / 100.0)
    ) STORED,

    vat_per_unit AS (
      net_unit_price * (vat / 100.0)
    ) STORED,

    total_price AS (
      quantity * net_unit_price
    ) STORED,

    total_amount_with_vat AS (
      total_price + quantity * vat_per_unit
    ) STORED,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id)
  );
    `);

  // await db.exec(`DROP TABLE IF EXISTS invoice_items`);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS purchases (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
  purchase_no TEXT NOT NULL UNIQUE,
  supplier_name TEXT NOT NULL,
  description TEXT NOT NULL, -- All items described in plain text
  total_amount REAL NOT NULL,
  paid_amount REAL NOT NULL,
  balance AS (total_amount - paid_amount) STORED,
  payment_status TEXT,
  purchase_date DATE NOT NULL DEFAULT (DATE('now')),
  remarks TEXT,
  is_deleted INTEGER DEFAULT 0, -- 👈 Correct way to set boolean-like field
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

  // await db.exec(`DROP TABLE IF EXISTS purchases`);
  console.log("✅ All tables created successfully");
};
