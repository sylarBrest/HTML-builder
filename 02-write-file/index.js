const path = require('path');
const fs = require('fs');
const streamRead = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');
const { stdin, stdout } = process;

let fileData = '';
streamRead.on('data', (chunk) => fileData += chunk);

const streamWrite = fs.createWriteStream(path.join(__dirname, 'text.txt'), 'utf-8');

streamWrite.write(fileData);
stdout.write('Привет! Введите текст для записи в файл\n');
stdin.on('data', data => {
  streamWrite.write(data);
});
process.on('SIGINT', () => {
  stdout.write('\nСпасибо! Пока!\n');
  process.exit(1);
});

/* let data = '';

stream.on('data', (chunk) => data += chunk);
stream.on('end', () => stdout.write(data));
stream.on('error', (err) => console.log(err.message));
 */