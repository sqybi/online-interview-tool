const router = require('koa-router')();

const create = require('./create');
const doc = require('./doc');

router.use('/__c', create.routes(), create.allowedMethods());
router.use('/d', doc.routes(), doc.allowedMethods());

module.exports = router;
