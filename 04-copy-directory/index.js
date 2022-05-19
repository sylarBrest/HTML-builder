const path = require('path');
const fs = require('fs/promises');

const dirPathIn = path.join(__dirname, 'files');
const dirPathOut = path.join(__dirname, 'files-copy');

(async () => {
  await fs.rm(dirPathOut, { recursive: true, force: true });
  await fs.mkdir(dirPathOut);
  const files = await fs.readdir(dirPathIn, { withFileTypes: true });
  files.forEach(async (file) => {
    if (file.isFile()) {
      await fs.copyFile(path.join(dirPathIn, file.name), path.join(dirPathOut, file.name));
    }
  });
})();
