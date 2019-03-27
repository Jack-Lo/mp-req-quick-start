const req = require('../../req/index.js');

Page({
  onLoad() {
    this.getMyInfo();
  },

  getMyInfo() {
    req.user.getMyInfo()
      .then((res) => {
        console.log(res);
      })
      .catch(req.err.show);
  },
});
