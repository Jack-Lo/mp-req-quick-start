const apiUrl = '/';

/**
 * code换取sessionId
 * @param {string} code
 */
function code2sessionId(code) {
  return new Promise((res, rej) => {
    wx.request({
      url: `${apiUrl}/api/login`,
      method: 'POST',
      data: {
        code,
      },
      success(r1) {
        if (r1.code === 0) {
          res(r1.data.sessionId);
        } else {
          rej(r1);
        }
      },
      fail: rej,
    });
  });
}

/**
 * 检查session是否有效
 * @param {any} res
 */
function isSessionAvailable(res) {
  return res.code !== 3000;
}

module.export = {
  apiUrl,
  code2sessionId,
  isSessionAvailable,
};
