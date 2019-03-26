const req = require('../../req/index.js');

Page({
  onLoad() {
    this.getWeather();
  },

  getWeather() {
    req.common.getWeather()
      .then((res) => {
        console.log(res);
      })
      .catch(req.err.show);
  },
});
