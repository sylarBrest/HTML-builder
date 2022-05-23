const path = require('path');
const fs = require('fs');
const stream = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');
const { stdout } = process;

let data = '';

stream.on('data', (chunk) => data += chunk);
stream.on('end', () => stdout.write(data));
stream.on('error', (err) => stdout.write(err.message));
