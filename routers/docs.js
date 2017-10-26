const util = require('util');
const router = require('koa-router')();

// Routing: /d

module.exports =
    router.get('/:doc_id', async (ctx, next) => {
        ctx.status = 200;
        ctx.body = util.format("Hello World from %s!", ctx.params.doc_id);
    });
