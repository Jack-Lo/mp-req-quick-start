module.export = {
  install(req, request) {
    req.common = {
      getWeather(data) {
        const url = 'https://www.tianqiapi.com/api/?version=v1';
        return request({ url, data }, false);
      },
    };
  },
};
