import * as t from '@babel/types';
import { NodePath } from '@babel/traverse';

/**
 * @example
 * `import N = N.S;` 中的 N.S => `"N.S"`;
 * @param node
 */
export function getTSQualifiedName(node: t.TSQualifiedName) {
  const identifiers: string[] = [node.right.name];
  let cur: t.TSQualifiedName = node;
  while (t.isTSQualifiedName(cur.left)) {
    cur = cur.left;
    identifiers.unshift(cur.right.name);
  }

  identifiers.unshift(cur.left.name);
  return identifiers.join('.');
}

export function getConstEnumMemberExpression(node: t.MemberExpression) {
  if (!t.isIdentifier(node.property)) {
    return null;
  }
  const identifiers: string[] = [node.property.name];
  let cur: t.MemberExpression = node;
  while (t.isMemberExpression(cur.object)) {
    cur = cur.object;
    const property = cur.property;
    if (!t.isIdentifier(property)) {
      return null;
    }
    identifiers.unshift(property.name);
  }
  if (!t.isIdentifier(cur.object)) {
    return null;
  }
  identifiers.unshift((cur.object as t.Identifier).name);
  return identifiers.join('.');
}

export function getNamespaceAliasMapFromProgram(
  body: t.Statement[],
  allKeys: string[]
): Map<string, string> {
  const alias = new Map<string, string>();
  const mayBeRenamedAlias: Array<[string, t.Identifier]> = []; // maybe
  body.forEach((d) => {
    if (!t.isTSImportEqualsDeclaration(d)) {
      return;
    }
    const left = d.id.name;
    const { moduleReference } = d;
    if (!t.isTSQualifiedName(moduleReference)) {
      if (t.isIdentifier(moduleReference)) {
        mayBeRenamedAlias.push([left, moduleReference]);
      }
      return;
    }
    const codeString = getTSQualifiedName(moduleReference);
    if (
      allKeys.some((key) => {
        return key.startsWith(codeString);
      })
    ) {
      alias.set(left, codeString);
    }
  });
  mayBeRenamedAlias.forEach(([l, identifier]) => {
    const trueNS = alias.get(identifier.name);
    if (trueNS) {
      alias.set(l, trueNS);
    } else {
      alias.set(l, identifier.name);
    }
  });
  return alias;
}

const DOT_REG = /\./g;
export function escapeDotForRegExp(pattern: string): string {
  const output = pattern.replace(DOT_REG, '\\.');
  DOT_REG.lastIndex = 0;
  return output;
}

/*
export function getLongestStartMatch(
  raw: string,
  patterns: string[]
): string | null {
  let resultPattern: string | null = null;
  for (const p of patterns) {
    if (raw.startsWith(p)) {
      if (!resultPattern || resultPattern.length < p.length) {
        resultPattern = p;
      }
    }
  }
  return resultPattern;
}
*/
