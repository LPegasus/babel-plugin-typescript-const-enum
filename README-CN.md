# babel-plugin-typescript-const-enum

![https://www.npmjs.com/package/babel-plugin-typescript-const-enum](https://img.shields.io/npm/v/babel-plugin-typescript-const-enum?style=flat-square)

## Description

一个用来处理 typescript const enum 语法转成换的 babel 插件

## Example

**some.d.ts**
```typescript
declare namespace N.S {
  export const enum STATUS {
    success = 0,
    fail = 1,
  }
}

declare const enum OUT_NS_STATUS {
  success = 0,
  fail = 1,
}
```

**index.ts**
```typescript
import NS2 = NS;
import NS = N.S;
import ONS = OUT_NS_STATUS;

export function foo() {
  const a = N.S.STATUS.fail;  // => 1
  const b = NS.STATUS.success;  // => 0
  const c = NS2.STATUS.fail;  // => 1
  const d = ONS.success;  // => 0
  function baz1() {
    const NS = { STATUS: { success: 'success', fail: 'fail' } };
    return NS.STATUS.success; // keep
  }
  function baz2() {
    const ONS = { success: 'success', fail: 'fail' };
    return ONS.success; // keep
  }
  function baz3() {
    const N = { S: { STATUS: { success: 'success', fail: 'fail' } } };
    function bas3Closure() {
      return N.S.STATUS.fail; // keep
    }
    return bas3Closure();
  }
  function haha() {
    return function () {
      return NS.STATUS.success; // => 0
    };
  }
  return;
}

```

## How to Use

Add plugin in babel config

**babel.config.json**
```json
{
  ...
  "plugins": [
    [
      "babel-plugin-typescript-const-enum",
      {
        "enumFile": "./my-const-enum.json",
        "enums": {
          "a.b.c.xxx": "xxx"
        }
      }
    ]
  ]
  ...
}
```

## Options
- enumFile `string`

  const enum 映射文件名，必须是个 json 文件

- enums

  传入如下格式的 json 对象

  ```json
  {
    "my.namespace.student.grade.LEVEL_ENUM.one": "一年级",
    "my.namespace.student.grade.LEVEL_ENUM.two": "二年级",
    "my.namespace.student.grade.LEVEL_ENUM.three": "三年级",
    "real.world.common.sense.DAY.SUNDAY": 7,
    "real.world.common.sense.DAY.MONDAY": 1,
    "real.world.common.sense.DAY.TUSEDAY": 2,
  }
  ```
  上面的 json 数据可能来自其他的 idl，并且有对于的如下 `d.ts` 文件来保证 TS 语法、类型校验
  ```typescript
  declare namespace my.namespace.student {
    export namespace grade {
      export const enum LEVEL_ENUM {
        one = '一年级',
        two = '二年级',
        three = '三年级'
      }
    }
  }

  declare namespace real.world.common.sense {
    export const enum DAY {
      SUNDAY = 7,
      MONDAY = 1,
      TUSEDAY = 2
    }
  }
  ```
