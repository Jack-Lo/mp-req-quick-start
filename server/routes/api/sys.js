var express = require('express');
var router = express.Router();

router.post('/login', function(req, res, next) {
  res.json({
    code: 0,
    data: {
      sessionId: new Date().getTime().toString(),
    },
    msg: 'ok',
  });
});

module.exports = router;
