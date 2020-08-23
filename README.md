# babel-plugin-typescript-const-enum

![https://www.npmjs.com/package/babel-plugin-typescript-const-enum](https://img.shields.io/npm/v/babel-plugin-typescript-const-enum?style=flat-square)

## Description

This plugin is to resolve typescript const enum declaration to hard code.

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

  a pathname to the enums json data

- enums

  an object of enums map like follows:

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
  the upon json may be from some idl, and there should be some `d.ts` file as following to ensure TS Language Server works OK:
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
