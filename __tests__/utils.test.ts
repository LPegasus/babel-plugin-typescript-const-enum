import {
  getTSQualifiedName,
  getConstEnumMemberExpression,
  getNamespaceAliasMapFromProgram,
  escapeDotForRegExp,
} from '../src/utils';
import * as t from '@babel/types';
import * as parser from '@babel/parser';

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
  [
    ['AliasNS1', 'A.B.C'],
    ['AliasNS2', 'A2.B2.C2'],
    ['RenamedNS', 'A.B.C'],
    ['STATUS', 'CONST_ENUM_STATUS'],
  ].forEach(([k, v]) => {
    expect(map.get(k)).toEqual(v);
  });
});

it('escapeDotForRegExp work success', () => {
  const output = escapeDotForRegExp('a.b.c');
  expect(output).toEqual(/a\.b\.c/.source);
});
