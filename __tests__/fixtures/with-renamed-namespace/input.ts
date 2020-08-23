import 'react';

import NS2 = NS;
import NS = N.S;
import ONS = OUT_NS_STATUS;

export function foo() {
  const a = N.S.STATUS.fail;
  const b = NS.STATUS.success;
  const c = NS2.STATUS.fail;
  const d = ONS.success;
  function baz1() {
    const NS = { STATUS: { success: 'success', fail: 'fail' } };
    return NS.STATUS.success;
  }
  function baz2() {
    const ONS = { success: 'success', fail: 'fail' };
    return ONS.success;
  }
  function baz3() {
    const N = { S: { STATUS: { success: 'success', fail: 'fail' } } };
    function bas3Closure() {
      return N.S.STATUS.fail;
    }
    return bas3Closure();
  }
  function haha() {
    return function () {
      return NS.STATUS.success;
    };
  }
  return;
}
