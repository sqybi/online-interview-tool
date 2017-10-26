const router = require('koa-router')();

// Routing: /

module.exports =
    router.get('/', async (ctx, next) => {
        ctx.status = 200;
        ctx.body = "Hello World!";
    });
