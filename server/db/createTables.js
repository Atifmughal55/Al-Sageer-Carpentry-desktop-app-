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
    total_amount REAL,         -- sum of total_price (excluding VAT)
    discount REAL DEFAULT 0,   -- total discount in PKR
    vat REAL DEFAULT 0,        -- total VAT in PKR
    total_with_vat REAL,       -- calculated in controller
    received REAL DEFAULT 0,
    remaining REAL,            -- calculated in controller
    is_deleted INTEGER DEFAULT 0,
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
  invoice_id INTEGER NOT NULL,
  description TEXT,
  quantity INTEGER,
  unit_price REAL,
  
  vat REAL DEFAULT 5,
  net_unit_price REAL,           -- calculated in controller
  vat_per_unit REAL,             -- calculated in controller
  total_price REAL,              -- calculated in controller
  total_amount_with_vat REAL,    -- calculated in controller
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

  db.run(`
     CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    recoveryCode TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
    `);
  // await db.exec(`DROP TABLE IF EXISTS users`);

  // If you want to keep this table creation (uncomment later)
  await db.exec(`
  CREATE TABLE IF NOT EXISTS walkIn_customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL DEFAULT 'WalkIn Customer',
    phone TEXT,
    items JSON, -- array of objects
    grand_total REAL,
    discount REAL,
    after_discount REAL,
    balance REAL,
    received REAL,
    status TEXT CHECK(status IN ('unpaid', 'partial', 'paid')) DEFAULT 'unpaid',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

  // If you just want to drop it:
  // await db.exec(`DROP TABLE IF EXISTS walkIn_customers`);

  console.log("✅ All tables created successfully");
};
