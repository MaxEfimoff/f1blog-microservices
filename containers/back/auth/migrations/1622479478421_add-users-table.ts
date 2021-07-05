/* eslint-disable camelcase */

// exports.shorthands = undefined;

function up(pgm) {
  pgm.sql(`
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,  
      name VARCHAR(50) NOT NULL,
      email VARCHAR(50) NOT NULL,
      password VARCHAR(500) NOT NULL,
      active BOOLEAN DEFAULT FALSE,
      role VARCHAR(50),
      version INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  pgm.sql(`
    CREATE TABLE confirmationhash (
      id SERIAL PRIMARY KEY,  
      hash VARCHAR(200),
      user_id INTEGER REFERENCES users(id)
    );
  `);

  pgm.sql(`
    CREATE TABLE resetpasswordhash (
      id SERIAL PRIMARY KEY,  
      hash VARCHAR(200),
      user_id INTEGER REFERENCES users(id),
      expires_at TIMESTAMP WITH TIME ZONE
    );
  `);

  pgm.sql(`
    CREATE TABLE changeemailhash (
      id SERIAL PRIMARY KEY,  
      hash VARCHAR(200),
      user_id INTEGER REFERENCES users(id)
    );
  `);
}

function down(pgm) {
  pgm.sql(`
    DROP TABLE users;
  `);
}

module.exports = { up, down };