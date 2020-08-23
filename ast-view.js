const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const babel = require('@babel/core');
const nodePath = require('path');
const fs = require('fs');

const code = fs.readFileSync(nodePath.resolve(__dirname, '__tests__/fixtures/with-renamed-namespace/input.ts'), 'utf8');
console.log(code);
console.log('----------------------------');

const ast = parser.parse(code, {
  sourceType: 'module',
  plugins: ['typescript']
});

const result = babel.transform(code, {
  filename: 'index.ts',
  presets: ["@babel/preset-typescript"],
  plugins: [[require('./lib/index').default, {
    enums: {
      'OUT_NS_STATUS.success': 0,
      'OUT_NS_STATUS.fail': 1,
      'N.S.STATUS.success': 0,
      'N.S.STATUS.fail': 1,
    }
  }]]
});

console.log(result.code);
