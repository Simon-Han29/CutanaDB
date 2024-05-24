// init.js
const client = require('./db');

const createTables = async () => {

    const deleteUsersTableQuery = `
        DROP TABLE users
    `

  const createUsersTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(100) NOT NULL,
      password VARCHAR(100) NOT NULL,
      userID VARCHAR(15) NOT NULL,
      animeList JSONB,
      mangaList JSONB,
      following JSONB,
      followers JSONB,
      customLists JSONB
    );
  `;
  
  try {
    await client.query(deleteUsersTableQuery);
    await client.query(createUsersTableQuery);
    console.log("Users table created successfully");
  } catch (err) {
    console.error("Error creating users table", err);
  }
};

const initDB = async () => {
  await createTables();
  client.end();
};

initDB();
