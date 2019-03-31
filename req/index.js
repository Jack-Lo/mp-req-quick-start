const req = require('../utils/mp-req/index.js');
// api
const userApi = require('./api/user.js');

const apiUrlTable = {
  local: 'http://localhost:8080',
  dev: 'http://192.168.1.100:8080',
  pre: 'https://stg-mp-req.leanapp.cn',
  release: 'https://mp-req.leanapp.cn',
};
const apiUrl = apiUrlTable.release;

/**
 * code换取sessionId
 * @param {string} code
 */
function code2sessionId(code) {
  return new Promise((res, rej) => {
    wx.request({
      url: `${apiUrl}/api/sys/login`,
      method: 'POST',
      data: {
        code,
      },
      success(r1) {
        if (r1.data && r1.data.code === 0) {
          res(r1.data.data.sessionId);
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

req.init({
  apiUrl,
  code2sessionId,
  isSessionAvailable,
});

req.use(userApi);

module.exports = req;
