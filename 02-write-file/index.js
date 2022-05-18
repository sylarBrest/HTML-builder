const path = require('path');
const fs = require('fs');
const { stdin, stdout } = process;
const stream = fs.createWriteStream(path.join(__dirname, 'text.txt'), 'utf-8');

stdout.write('Привет! Введите текст для записи в файл\n');
stdin.on('data', data => {
  if (data.toString().trim() === 'exit') process.exit();
  stream.write(data);
});
process.on('exit', () => {
  stdout.write('\nСпасибо! Пока!\n');
});
process.on('SIGINT', () => process.exit());
