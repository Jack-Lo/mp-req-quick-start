const {
  code2sessionId, isSessionAvailable,
} = require('./config.js');

let sessionId = wx.getStorageSync('sessionId');
let loginQueue = [];
let isLoginning = false;

const R = {};

/**
 * 判断请求状态是否成功
 * @param {number} status
 */
function isHttpSuccess(status) {
  return (status >= 200 && status < 300) || status === 304;
}

/**
 * promise请求
 * @param {object} options {}
 */
function requestP(options = {}) {
  const {
    url,
    data,
    method,
    dataType,
    responseType,
    success,
    fail,
    complete,
  } = options;

  // 统一注入约定的header
  const header = Object.assign({
    sessionId,
  }, options.header);

  return new Promise((res, rej) => {
    wx.request({
      url,
      data,
      header,
      method,
      dataType,
      responseType,
      success(r) {
        const isSuccess = isHttpSuccess(r.statusCode);

        if (isSuccess) { // 成功的请求状态
          if (success) {
            success(r.data);
          }
          res(r.data);
        } else {
          if (fail) {
            fail({
              msg: `服务器好像出了点小问题，请与客服联系~（错误代码：${r.statusCode}）`,
              detail: r,
            });
          }
          rej({
            msg: `服务器好像出了点小问题，请与客服联系~（错误代码：${r.statusCode}）`,
            detail: r,
          });
        }
      },
      fail(err) {
        if (fail) {
          fail(err);
        }
        rej(err);
      },
      complete,
    });
  });
}

/**
 * 登录
 */
function login() {
  return new Promise((res, rej) => {
    // 微信登录
    wx.login({
      success(r1) {
        if (r1.code) {
          // 获取sessionId
          code2sessionId(r1.code)
            .then((r2) => {
              const newSessionId = r2;
              sessionId = newSessionId; // 更新sessionId
              // 保存sessionId
              wx.setStorage({
                key: 'sessionId',
                data: newSessionId,
              });
              res(r2);
            })
            .catch((err) => {
              rej(err);
            });
        } else {
          rej(r1);
        }
      },
      fail(err) {
        rej(err);
      },
    });
  });
}

/**
 * 获取sessionId
 */
function getSessionId() {
  return new Promise((res, rej) => {
    // 本地sessionId丢失，重新登录
    if (!sessionId) {
      loginQueue.push({ res, rej });

      if (!isLoginning) {
        isLoginning = true;

        login()
          .then((r1) => {
            isLoginning = false;
            loginQueue.map(q => q.res(r1));
            loginQueue = [];
          })
          .catch((err) => {
            isLoginning = false;
            loginQueue.map(q => q.rej(err));
            loginQueue = [];
          });
      }
    } else {
      res(sessionId);
    }
  });
}

/**
 * ajax高级封装
 * @param {object} options {}
 * @param {boolean} keepLogin true
 */
function req(options = {}, keepLogin = true) {
  if (keepLogin) {
    return new Promise((res, rej) => {
      getSessionId()
        .then(() => {
          // 获取sessionId成功之后，发起请求
          requestP(options)
            .then((r2) => {
              if (!isSessionAvailable(r2)) {
                /**
                 * 登录状态无效，则重新走一遍登录流程
                 * 销毁本地已失效的sessionId
                 */
                sessionId = '';
                getSessionId()
                  .then(() => {
                    requestP(options)
                      .then((r4) => {
                        res(r4);
                      })
                      .catch((err) => {
                        rej(err);
                      });
                  });
              } else {
                res(r2);
              }
            })
            .catch((err) => {
              // 请求出错
              rej(err);
            });
        })
        .catch((err) => {
          // 获取sessionId失败
          rej(err);
        });
    });
  }
  // 不需要sessionId，直接发起请求
  return requestP(options);
}

/**
 * 插件接口
 * @param {object} plugin
 */
function use(plugin) {
  return plugin.install(R, req);
}

R.use = use;

module.exports = R;
