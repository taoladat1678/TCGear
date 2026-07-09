const fs = require('fs');
let lines = fs.readFileSync('index.js', 'utf8').split('\n');

const newCode = `        const order_time = clientTime || now.toTimeString().split(' ')[0];

        // 2. Insert order
        await db.query(
          \`INSERT INTO orders (
            order_id, user_id, order_date, order_time, order_status, 
            payment_status, payment_method, shipping_method, recipient_name, 
            recipient_phone, recipient_email, shipping_address, shipping_status, note, applied_vouchers
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)\`,
          [
            order_id, user_id, order_date, order_time, 'Chờ xác nhận',
            'Chờ thanh toán', payment_method || 'Thanh Toán Khi Nhận Hàng', shipping_method || 'Giao Hàng Tiêu Chuẩn',
            recipient_name || '', recipient_phone || '', recipient_email || '',
            shipping_address, 'Chờ xử lý', note || '',
            (applied_vouchers && applied_vouchers.length > 0) ? applied_vouchers.join(',') : null
          ]
        );

        // 3. Insert order details
        const [[{ count: detailCount }]] = await db.query('SELECT COUNT(*) AS count FROM order_details');
        let nextDetailNum = detailCount + 1;`;

let startIdx = -1;
let endIdx = -1;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('const order_time = clientTime || now.toTimeString().split(\' \')[0];')) {
    startIdx = i;
  }
  if (lines[i].includes("let nextDetailNum = detailCount + 1;")) {
    endIdx = i;
    break;
  }
}

if (startIdx !== -1 && endIdx !== -1) {
  lines.splice(startIdx, endIdx - startIdx + 1, newCode);
  fs.writeFileSync('index.js', lines.join('\n'), 'utf8');
  console.log('Success!');
} else {
  console.log('Indices not found:', startIdx, endIdx);
}
