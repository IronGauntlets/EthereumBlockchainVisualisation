const express  = require('express');
const router = express.Router();

router.get('/', function(req, res) {
  res.send('GET block');
});

module.exports = router;
