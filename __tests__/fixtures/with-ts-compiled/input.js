var HOHOHO = {};

var SuccessCode = {
  HOHO: {
    HAHA_COMMON: {
      SuccessCode: {
        OK: 'OK',
        FAIL: 'FAIL'
      }
    }
  }
};

var ErrorCode = HOHO.HAHA_COMMON.ErrorCode;
var P = HOHOHO.A;

const ErrorToString = (code) => {
  const readableString = {
    [ErrorCode.A]: '1',
    [ErrorCode.B]: '2',
    [ErrorCode.C]: '3',
    [SuccessCode.HOHO.HAHA_COMMON.SuccessCode.OK]: '4',
    [SuccessCode.HOHO.HAHA_COMMON.SuccessCode.FAIL]: '5',
    [P.A]: 'undefined'
  }[code];
  return readableString || '未知错误，保留现场，联系研发';
};
