const path = require('path');
const fs = require('fs');

const dirProject = path.join(__dirname, 'project-dist');

// Create directory 'project-dist' and use other functions
async function startProject() {
  await fs.promises.rm(dirProject, { recursive: true, force: true });
  await fs.promises.mkdir(dirProject);
  await copyAssets(path.join(__dirname, 'assets'), path.join(dirProject, 'assets'));
  await workWithStyles();
  await makeIndex();
}

// Copy recursively directory 'assets' in 'project-dist'
async function copyAssets(dirPathIn, dirPathOut) {
  await fs.promises.rm(dirPathOut, { recursive: true, force: true });
  await fs.promises.mkdir(dirPathOut);
  const elements = await fs.promises.readdir(dirPathIn, { withFileTypes: true });
  elements.forEach(async (file) => {
    if (file.isFile()) {
      await fs.promises.copyFile(path.join(dirPathIn, file.name), path.join(dirPathOut, file.name));
    }
    else {
      await copyAssets(path.join(dirPathIn, file.name), path.join(dirPathOut, file.name));
    }
  });
}

// Merge styles in one file
async function workWithStyles() {
  const writeStream = fs.createWriteStream(path.join(dirProject, 'style.css'), 'utf-8');

  const sourceStylePath = path.join(__dirname, 'styles');

  const files = await fs.promises.readdir(sourceStylePath, { withFileTypes: true });
  files.filter((file) => file.isFile()).forEach(async (file) => {
    const filePath = path.join(sourceStylePath, file.name);
    if (path.extname(filePath) === '.css') {
      const readStream = fs.createReadStream(filePath, 'utf-8');
      readStream.pipe(writeStream);
    }
  });
}

// Get HTML files
const htmlTemplates = async function() {
  const res = {};
  const componentsPath = path.join(__dirname, 'components');
  const components = await fs.promises.readdir(componentsPath, { withFileTypes: true });
  for (const file of components) {
    const filePath = path.join(componentsPath, file.name);
    if (file.isFile() && (path.extname(filePath) === '.html')) {
      const data = await fs.promises.readFile(filePath);
      res[file.name] = data.toString();
    }
  }
  return res;
};

// Create index.html  & replace tags with templates
async function makeIndex() {
  const components = await htmlTemplates();
  const stream = fs.createWriteStream(path.join(dirProject, 'index.html'));

  fs.readFile(path.join(__dirname, 'template.html'), 'utf-8', (err, data) => {
    if (err) throw err.message;
    let res = data;
    for (const comp of Object.keys(components)) {
      res = res.replace(`{{${comp.split('.')[0]}}}`, components[comp]);
    }
    stream.write(res);
  }); 
}

startProject();