import {
  getTSQualifiedName,
  getConstEnumMemberExpression,
  getNamespaceAliasMapFromProgram,
  escapeDotForRegExp,
} from '../src/utils';
import * as t from '@babel/types';
import * as parser from '@babel/parser';
import * as babel from '@babel/core';

const _code = `
import React from 'react';

import AliasNS1 = A.B.C;
import AliasNS2 = A2.B2.C2;
import RenamedNS = AliasNS1;
import STATUS = CONST_ENUM_STATUS;

const v1 = A.B.C.STATUS.string;
const v2 = AliasNS1.STATUS.boolean;
const v3 = RenamedNS.STATUS.number;
const v4 = AliasNS2.STATUS.string;
const v5 = CONST_ENUM_STATUS.success;
const v6 = STATUS.success;
`.trim();

const _code2 = `
import React from 'react';

var AliasNS1 = A.B.C;
var AliasNS2 = A2.B2.C2;
var RenamedNS = AliasNS1;
var STATUS = CONST_ENUM_STATUS;

const v1 = A.B.C.STATUS.string;
const v2 = AliasNS1.STATUS.boolean;
const v3 = RenamedNS.STATUS.number;
const v4 = AliasNS2.STATUS.string;
const v5 = CONST_ENUM_STATUS.success;
const v6 = STATUS.success;
`;

const _enums = {
  'A.B.C.STATUS.string': '0',
  'A.B.C.STATUS.boolean': false,
  'A.B.C.STATUS.number': 0,
  'A2.B2.C2.STATUS.string': '0',
  'A2.B2.C2.STATUS.boolean': false,
  'A2.B2.C2.STATUS.number': 0,
  'CONST_ENUM_STATUS.success': 0,
};

const _expect = `
import React from 'react';

import AliasNS1 = A.B.C;
import AliasNS2 = A2.B2.C2;
import RenamedNS = AliasNS1;
import STATUS = CONST_ENUM_STATUS;

const v1 = '0' /* string */;
const v2 = false /* boolean */;
const v3 = 0 /* number */;
const v4 = '0' /* string */;
const v5 = 0 /* success */;
const v6 = 0 /* success */;
`.trim();

it('getTSQualifiedName work success', () => {
  const source = getTSQualifiedName(
    t.tsQualifiedName(
      t.tsQualifiedName(
        t.tsQualifiedName(t.identifier('A'), t.identifier('B')),
        t.identifier('C')
      ),
      t.identifier('D')
    )
  );
  expect(source).toEqual('A.B.C.D');
});

it('getConstEnumMemberExpression work success', () => {
  const source = getConstEnumMemberExpression(
    t.memberExpression(
      t.memberExpression(t.identifier('A'), t.identifier('B')),
      t.identifier('C')
    )
  );
  expect(source).toEqual('A.B.C');
});

it('getNamespaceAliasMapFromProgram work success', () => {
  const ast = parser.parse(_code, {
    plugins: ['typescript'],
    sourceFilename: 'index.ts',
    sourceType: 'module',
  });

  const map = getNamespaceAliasMapFromProgram(
    ast.program.body,
    Object.keys(_enums)
  );

  const expected = new Map([
    ['AliasNS1', 'A.B.C'],
    ['AliasNS2', 'A2.B2.C2'],
    ['RenamedNS', 'A.B.C'],
    ['STATUS', 'CONST_ENUM_STATUS'],
  ]);

  expect(map).toEqual(expected);
});

it('getNamespaceAliasMapFromProgram works with ts transpiled code', () => {
  const ast = parser.parse(_code2, {
    plugins: ['typescript'],
    sourceFilename: 'index.ts',
    sourceType: 'module',
  });

  let nodePath = undefined;
  babel.transformFromAstSync(ast, _code2, {
    plugins: [
      {
        visitor: {
          Program(path) {
            nodePath = path;
          },
        },
      },
    ],
  });

  const map = getNamespaceAliasMapFromProgram(
    ast.program.body,
    Object.keys(_enums),
    nodePath
  );

  const expected = new Map([
    ['AliasNS1', 'A.B.C'],
    ['AliasNS2', 'A2.B2.C2'],
    ['RenamedNS', 'A.B.C'],
    ['STATUS', 'CONST_ENUM_STATUS'],
    ['v1', 'A.B.C.STATUS.string'],
    ['v5', 'CONST_ENUM_STATUS.success'],
  ]);
  expect(map).toEqual(expected);
});

it('escapeDotForRegExp work success', () => {
  const output = escapeDotForRegExp('a.b.c');
  expect(output).toEqual(/a\.b\.c/.source);
});
