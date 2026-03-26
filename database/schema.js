import pool from './main.js';

export async function initializeSchema() {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        avatar INT NOT NULL DEFAULT 0,
        theme INT NOT NULL DEFAULT 1,
        is_admin BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Sigils table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS sigils (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        user_id INT NOT NULL,
        intention TEXT,
        canvas_data LONGTEXT,
        image_data LONGTEXT,
        is_charged BOOLEAN NOT NULL DEFAULT FALSE,
        location_name VARCHAR(200),
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Sigil Groups (many-to-many relationship for sigilGroup field)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS sigil_groups (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sigil_id INT NOT NULL,
        group_member VARCHAR(100) NOT NULL,
        FOREIGN KEY (sigil_id) REFERENCES sigils(id) ON DELETE CASCADE
      )
    `);

    // SVG Vector Data table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS svg_vectors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sigil_id INT NOT NULL,
        filename VARCHAR(255) NOT NULL,
        vector_data TEXT NOT NULL,
        width INT NOT NULL,
        height INT NOT NULL,
        file_size INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sigil_id) REFERENCES sigils(id) ON DELETE CASCADE
      )
    `);

    await connection.commit();
    console.log('Database schema initialized successfully');
  } catch (error) {
    await connection.rollback();
    console.error('Error initializing schema:', error);
    throw error;
  } finally {
    connection.release();
  }
}

initializeSchema();