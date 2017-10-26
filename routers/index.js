const router = require('koa-router')();

const home = require('./home');
const docs = require('./docs');

router.use('/', home.routes(), home.allowedMethods());
router.use('/d', docs.routes(), docs.allowedMethods());

module.exports = router;
