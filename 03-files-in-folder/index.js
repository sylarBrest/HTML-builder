const path = require('path');
const fs = require('fs');
const { stdout } = process;

const dirPath = path.join(__dirname, 'secret-folder');
fs.readdir(dirPath, {withFileTypes: true}, (err, files) => {
  if (err) throw err.message();
  files.forEach(file => {
    const filePath = dirPath + '\\' + file.name;
    fs.stat(filePath, (err, data) => {
      if (data.isFile()) {
        const name = file.name.slice(0, file.name.lastIndexOf('.'));
        const ext = path.extname(filePath).slice(path.extname(filePath).lastIndexOf('.') + 1);
        const size = (data.size / 1024).toFixed(3) + 'kb';
        stdout.write(`${name} - ${ext} - ${size}\n`);
      }
    });
  });
});
