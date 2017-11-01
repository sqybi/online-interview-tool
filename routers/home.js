const router = require('koa-router')();
const controller = require('../controllers/home');

// Routing: /

module.exports =
    router.get('/', controller.get_home);
