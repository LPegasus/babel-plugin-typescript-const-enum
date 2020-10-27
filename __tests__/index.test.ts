import * as path from 'path';
import * as fs from 'fs';
import * as babel from '@babel/core';
import babelPluginTypescriptConstEnum from '../src/index';

const fixtures_dirname = path.resolve(__dirname, './fixtures');

it('with renamed namespace work success', async () => {
  const tInput = fs.promises.readFile(
    path.resolve(fixtures_dirname, 'with-renamed-namespace/input.ts'),
    'utf8'
  );
  const input = await tInput;

  const result = await babel.transformAsync(input, {
    presets: ['@babel/preset-typescript'],
    filename: 'input.ts',
    plugins: [
      [
        babelPluginTypescriptConstEnum,
        {
          enums: {
            'OUT_NS_STATUS.success': 0,
            'OUT_NS_STATUS.fail': 1,
            'N.S.STATUS.success': 0,
            'N.S.STATUS.fail': 1,
          },
        },
      ],
    ],
  });

  expect(result?.code).toMatchSnapshot();
});

it('without renamed namespace work success', async () => {
  const tInput = fs.promises.readFile(
    path.resolve(fixtures_dirname, 'without-renamed-namespace/input.ts'),
    'utf8'
  );
  const input = await tInput;

  const result = await babel.transformAsync(input, {
    presets: ['@babel/preset-typescript'],
    filename: 'input.ts',
    plugins: [
      [
        babelPluginTypescriptConstEnum,
        {
          enums: {
            'OUT_NS_STATUS.success': 0,
            'OUT_NS_STATUS.fail': 1,
            'N.S.STATUS.success': 0,
            'N.S.STATUS.fail': 1,
          },
        },
      ],
    ],
  });

  expect(result?.code).toMatchSnapshot();
});

it('with-ts-compiled should be work', async () => {
  const tInput = fs.promises.readFile(
    path.resolve(fixtures_dirname, 'with-ts-compiled/input.js'),
    'utf8'
  );
  const input = await tInput;

  const result = await babel.transformAsync(input, {
    presets: [],
    filename: 'input.js',
    plugins: [
      [
        babelPluginTypescriptConstEnum,
        {
          enums: {
            'HOHO.HAHA_COMMON.ErrorCode.A': 'A',
            'HOHO.HAHA_COMMON.ErrorCode.B': 'B',
            'HOHO.HAHA_COMMON.ErrorCode.C': 'C',
          },
        },
      ],
    ],
  });

  expect(result?.code).toMatchSnapshot();
});
