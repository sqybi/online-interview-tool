const router = require('koa-router')();
const controller = require('../controllers/create');

// Routing: /

module.exports =
    router.get('/', controller.get_create);
