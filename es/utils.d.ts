import * as t from '@babel/types';
import type { NodePath } from '@babel/core';
import type { Program } from '@babel/types';
/**
 * @example
 * `import N = N.S;` 中的 N.S => `"N.S"`;
 * @param node
 */
export declare function getTSQualifiedName(node: t.TSQualifiedName): string;
export declare function getConstEnumMemberExpression(node: t.MemberExpression): string | null;
export declare function getNamespaceAliasMapFromProgram(body: t.Statement[], allKeys: string[], path?: NodePath<Program>): Map<string, string>;
export declare function escapeDotForRegExp(pattern: string): string;
