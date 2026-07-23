require('dotenv').config();
const connectDb = require('./db');

async function migrate() {
  const db = await connectDb();
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS refund_requests (
        refund_id varchar(20) NOT NULL,
        order_id varchar(20) NOT NULL,
        user_id varchar(20) NOT NULL,
        refund_reason text DEFAULT NULL,
        proof_images text DEFAULT NULL,
        status varchar(50) DEFAULT 'Chờ xử lý',
        created_at datetime NOT NULL,
        updated_at datetime NOT NULL,
        PRIMARY KEY (refund_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    console.log('Created refund_requests table');

    await db.query(`
      CREATE TABLE IF NOT EXISTS refund_items (
        id int(11) NOT NULL AUTO_INCREMENT,
        refund_id varchar(20) NOT NULL,
        variant_id varchar(20) NOT NULL,
        quantity int(11) NOT NULL,
        refund_amount float NOT NULL DEFAULT 0,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    console.log('Created refund_items table');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    process.exit(0);
  }
}

migrate();
