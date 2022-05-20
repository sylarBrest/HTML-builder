const path = require('path');
const fs = require('fs/promises');

const dirProject = path.join(__dirname, 'project-dist');

// Create directory 'project-dist'
async function startProject() {
  await fs.rm(dirProject, { recursive: true, force: true });
  await fs.mkdir(dirProject);
  copyAssets(path.join(__dirname, 'assets'), path.join(dirProject, 'assets'));
  workWithStyles();
}

// Copy recursively directory 'assets' in 'project-dist'
async function copyAssets(dirPathIn, dirPathOut) {
  await fs.rm(dirPathOut, { recursive: true, force: true });
  await fs.mkdir(dirPathOut);
  const elements = await fs.readdir(dirPathIn, { withFileTypes: true });
  elements.forEach(async (file) => {
    if (file.isFile()) {
      await fs.copyFile(path.join(dirPathIn, file.name), path.join(dirPathOut, file.name));
    }
    else {
      await copyAssets(path.join(dirPathIn, file.name), path.join(dirPathOut, file.name));
    }
  });
}

function workWithStyles() {
  const fs = require('fs');
  const writeStream = fs.createWriteStream(path.join(dirProject, 'style.css'), 'utf-8');

  const sourceStylePath = path.join(__dirname, 'styles');

  function readStream(stream) {
    return new Promise((resolve, reject) => {
      let data = '';
      stream.on('data', (chunk) => data += chunk);
      stream.on('end', () => resolve(`${data}\n`));
      stream.on('error', (err) => reject(err));
    });
  }

  async function mergeStyles() {
    const files = await fs.promises.readdir(sourceStylePath, {withFileTypes: true});
    files.forEach(async (file) => {
      const filePath = path.join(sourceStylePath, file.name);
      if (file.isFile() && (path.extname(filePath) === '.css')) {
        const stream = fs.createReadStream(filePath, 'utf-8');
        const fileData = await readStream(stream);
        writeStream.write(fileData);
      }
    });
  }

  mergeStyles();
}

startProject();