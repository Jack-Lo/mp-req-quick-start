const req = require('./req/index.js');
const userApi = require('./api/user.js');

req.use(userApi);

App({});
