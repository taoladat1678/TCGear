const db = require('./db');
async function run() {
  const connection = await db();
  const [rows] = await connection.query('DESCRIBE orders');
  console.log(rows);
  process.exit(0);
}
run();
