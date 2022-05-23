const path = require('path');
const fs = require('fs');
const writeStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'), 'utf-8');

const sourceDirPath = path.join(__dirname, 'styles');

(async () => {
  const files = await fs.promises.readdir(sourceDirPath, { withFileTypes: true });
  files.filter((file) => file.isFile()).forEach((file) => {
    const filePath = path.join(sourceDirPath, file.name);
    if (path.extname(filePath) === '.css') {
      const readStream = fs.createReadStream(filePath, 'utf-8');
      readStream.pipe(writeStream);
    }
  });
})();
