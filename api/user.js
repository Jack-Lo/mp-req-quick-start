const { apiUrl } = require('../req/config.js');

module.exports = {
  install(req, request) {
    req.user = {
      getMyInfo() {
        const url = `${apiUrl}/api/user/myInfo`;
        return request({ url });
      },
    };
  },
};
