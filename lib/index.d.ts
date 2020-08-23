import b from '@babel/core';
export default function babelPluginTypescriptConstEnum(_: typeof b, options?: {
    enums?: Record<string, string | number | boolean>;
    enumFile?: string;
}): {
    visitor: b.Visitor<{}>;
};
