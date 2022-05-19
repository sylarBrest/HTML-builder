const path = require('path');
const fs = require('fs/promises');
const { stdout } = process;

const dirPath = path.join(__dirname, 'secret-folder');

(async () => {
  const files = await fs.readdir(dirPath, {withFileTypes: true});
  files.forEach(async (file) => {
    const filePath = path.join(dirPath, file.name);
    const data = await fs.stat(filePath);
    if (data.isFile()) {
      const name = file.name.slice(0, file.name.lastIndexOf('.'));
      const ext = path.extname(filePath).slice(path.extname(filePath).lastIndexOf('.') + 1);
      const size = (data.size / 1024).toFixed(3) + 'kb';
      stdout.write(`${name} - ${ext} - ${size}\n`);
    }
  });
})();
