const config = require('config');
const util = require('util');
const koaStatic = require('koa-static');
const koa = require('koa');
const path = require('path');
const router = require('./routers/index');

const app = new koa();
const staticPath = './static';

function start() {
    /* Middleware */

    // Static
    app.use(koaStatic(path.join(__dirname, staticPath)));

    // Logging
    app.use(async (ctx, next) => {
        let start_time = new Date();
        try {
            await next();
        } catch (err) {
            ctx.body = {message: err.message};
            ctx.status = err.status || 500;
        }
        let time_passed = new Date() - start_time;
        console.log(util.format('[%s %s] process time: %d ms, status code: %d', ctx.method, ctx.url, time_passed, ctx.status));
    });

    // Router
    app.use(router.routes()).use(router.allowedMethods());

    /* End of Middleware */

    // Start server
    app.listen(config.listen_port);
}

module.exports = {
    start: start
};