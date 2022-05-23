const path = require('path');
const fs = require('fs/promises');

const dirPath = path.join(__dirname, 'secret-folder');

(async () => {
  const files = await fs.readdir(dirPath, { withFileTypes: true });
  files.filter((file) => file.isFile()).forEach(async (file) => {
    const filePath = path.join(dirPath, file.name);
    const data = await fs.stat(filePath);
    const name = file.name.slice(0, file.name.lastIndexOf('.'));
    const ext = path.extname(filePath).slice(1);
    const size = (data.size / 1024).toFixed(3) + 'kb';
    process.stdout.write(`${name} - ${ext} - ${size}\n`);
  });
})();
