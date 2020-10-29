import * as t from '@babel/types';
/**
 * @example
 * `import N = N.S;` 中的 N.S => `"N.S"`;
 * @param node
 */
export function getTSQualifiedName(node) {
    const identifiers = [node.right.name];
    let cur = node;
    while (t.isTSQualifiedName(cur.left)) {
        cur = cur.left;
        identifiers.unshift(cur.right.name);
    }
    identifiers.unshift(cur.left.name);
    return identifiers.join('.');
}
export function getConstEnumMemberExpression(node) {
    if (!t.isIdentifier(node.property)) {
        return null;
    }
    const identifiers = [node.property.name];
    let cur = node;
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
    identifiers.unshift(cur.object.name);
    return identifiers.join('.');
}
export function getNamespaceAliasMapFromProgram(body, allKeys, path) {
    const alias = new Map();
    const mayBeRenamedAlias = []; // maybe
    const pendingRemoveBodyIndexList = [];
    const rootSet = new Set();
    allKeys.forEach((k) => {
        const root = k.split('.')[0];
        rootSet.add(root);
    });
    body.forEach((d, index) => {
        if (!t.isTSImportEqualsDeclaration(d)) {
            if (path && t.isVariableDeclaration(d) && d.declarations.length === 1) {
                const firstDeclaratorInit = d.declarations[0].init;
                if (t.isMemberExpression(firstDeclaratorInit)) {
                    // tsc 之后 import xxx = v.v.v 会变成 var xxx = v.v.v
                    // 这里处理 tsc 后的代码
                    const memberExpCode = path
                        .getSource()
                        .substring(firstDeclaratorInit.start, firstDeclaratorInit.end);
                    const root = memberExpCode.split('.')[0];
                    if (!root) {
                        return;
                    }
                    // 去掉非全局变量 或者 enums key 中并没有这个 root 的情况
                    if (path.scope.getBindingIdentifier(root) || !rootSet.has(root)) {
                        return;
                    }
                    pendingRemoveBodyIndexList.unshift(index);
                    alias.set(d.declarations[0].id.name, memberExpCode);
                }
                else if (t.isIdentifier(firstDeclaratorInit)) {
                    const left = d.declarations[0].id.name;
                    const right = firstDeclaratorInit.name;
                    const memberExpCodeMaybe = alias.get(right);
                    if (memberExpCodeMaybe) {
                        pendingRemoveBodyIndexList.unshift(index);
                        alias.set(left, memberExpCodeMaybe);
                    }
                    if (!path.scope.getBindingIdentifier(right)) {
                        alias.set(left, right);
                    }
                }
            }
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
        if (allKeys.some((key) => {
            return key.startsWith(codeString);
        })) {
            alias.set(left, codeString);
        }
    });
    mayBeRenamedAlias.forEach(([l, identifier]) => {
        const trueNS = alias.get(identifier.name);
        if (trueNS) {
            alias.set(l, trueNS);
        }
        else {
            alias.set(l, identifier.name);
        }
    });
    if (path) {
        pendingRemoveBodyIndexList.forEach((index) => {
            path.get('body.' + index).remove();
        });
    }
    return alias;
}
const DOT_REG = /\./g;
export function escapeDotForRegExp(pattern) {
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
//# sourceMappingURL=utils.js.map