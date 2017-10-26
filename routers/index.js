const router = require('koa-router')();

const home = require('./home');
const doc = require('./doc');

router.use('/', home.routes(), home.allowedMethods());
router.use('/d', doc.routes(), doc.allowedMethods());

module.exports = router;
