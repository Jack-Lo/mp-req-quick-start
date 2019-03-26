const req = require('./req/index.js');
const commonApi = require('./req/api/common.js');

req.use(commonApi);

App({});
