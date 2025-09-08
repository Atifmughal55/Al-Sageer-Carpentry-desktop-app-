export const registerUsre = (db, data) => {
  const { email, password, recoveryCode } = data;

  return db.run(
    "INSERT INTO users (email, password, recoveryCode) VALUES (?, ?, ?)",
    [email, password, recoveryCode]
  );
};

export const getUser = (db, email) => {
  return db.get(`SELECT * FROM users WHERE email = ?`, [email]);
};

export const updatePasswordModel = (db, data) => {
  const { email, password } = data;

  return db.run(`UPDATE users SET password = ? WHERE email=?`, [
    password,
    email,
  ]);
};
