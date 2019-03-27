var express = require('express');
var router = express.Router();

router.get('/myInfo', function(req, res, next) {
  res.json({
    code: 0,
    data: 'ok',
    msg: 'ok',
  });
});

module.exports = router;
