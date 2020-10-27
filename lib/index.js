"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path = tslib_1.__importStar(require("path"));
const t = tslib_1.__importStar(require("@babel/types"));
const utils_1 = require("./utils");
const EMPTY = {
    alias: new Map(),
    enums: {},
};
const internalVisitor = {
    TSImportEqualsDeclaration(path) {
        path.remove();
    },
    MemberExpression(path, state) {
        const { enums = EMPTY.enums, namespaceAlias = EMPTY.alias } = state;
        const key = utils_1.getConstEnumMemberExpression(path.node);
        if (!key) {
            return;
        }
        const firstIdentifier = key.split('.')[0];
        const binding = path.scope.getBindingIdentifier(firstIdentifier);
        if (binding) {
            path.skip();
            return;
        }
        let v = enums[key];
        if (typeof v === 'undefined') {
            for (const [left, right] of namespaceAlias) {
                if (!key.startsWith(left)) {
                    continue;
                }
                const newKey = key.replace(new RegExp('^' + utils_1.escapeDotForRegExp(left)), right);
                if (enums[newKey] !== undefined) {
                    v = enums[newKey];
                    break;
                }
            }
        }
        if (typeof v === 'undefined') {
            return;
        }
        let replaced;
        if (typeof v === 'number') {
            replaced = t.numericLiteral(v);
        }
        else if (typeof v === 'boolean') {
            replaced = t.booleanLiteral(v);
        }
        else if (typeof v === 'string') {
            replaced = t.stringLiteral(v);
        }
        if (!replaced) {
            return;
        }
        const lastDot = key.lastIndexOf('.');
        const label = key.substr(lastDot + 1);
        if (replaced) {
            path.replaceWith(replaced);
            path.addComment('trailing', label, false);
        }
    },
};
function babelPluginTypescriptConstEnum(_, options = {}) {
    let { enums = {}, enumFile } = options;
    enums = enums || {};
    if (enumFile) {
        enums = { ...require(path.resolve(process.cwd(), enumFile)), ...enums };
    }
    const allKeys = Object.keys(enums);
    if (!allKeys) {
        return { visitor: {} };
    }
    return {
        visitor: {
            Program(path) {
                const namespaceAlias = utils_1.getNamespaceAliasMapFromProgram(path.node.body, allKeys, path);
                path.traverse(internalVisitor, {
                    enums,
                    namespaceAlias,
                });
            },
        },
    };
}
exports.default = babelPluginTypescriptConstEnum;
//# sourceMappingURL=index.js.map