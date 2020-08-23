const fs = require('fs');
const path = require('path');
const glob = require('glob');

const dir = path.resolve(__dirname, 'es');
const files = glob.sync('**/*.js', { cwd: dir });

files.forEach(f => {
  const p = path.resolve(dir, f);
  fs.rename(p, p.replace(/\.js$/, '.mjs'), () => { });
});
