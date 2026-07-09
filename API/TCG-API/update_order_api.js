const fs = require('fs');
let code = fs.readFileSync('index.js', 'utf8');

// Replace the columns
code = code.replace(
  /recipient_phone,\s*recipient_email,\s*shipping_address,\s*shipping_status,\s*note/g, 
  "recipient_phone, recipient_email, shipping_address, shipping_status, note, applied_vouchers"
);

// Replace the VALUES placeholders
code = code.replace(
  /\) VALUES \(\?, \?, \?, \?, \?, \?, \?, \?, \?, \?, \?, \?, \?, \?\)`/g,
  ") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`"
);

// Replace the values array
const regexValues = /shipping_address,\s*'Chá»\s*xá»­ lĂ½',\s*note \|\| ''\s*\]/g;
const replacement = "shipping_address, 'Chá»  xá»­ lĂ½', note || '',\n            (applied_vouchers && applied_vouchers.length > 0) ? applied_vouchers.join(',') : null\n          ]";

code = code.replace(regexValues, replacement);

fs.writeFileSync('index.js', code, 'utf8');
console.log("Successfully updated order insertion via regex!");
