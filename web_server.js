const config = require('./config');
const router = require('./routers/index');
const util = require('util');
const koaBodyParser = require('koa-bodyparser');
const koaStatic = require('koa-static');
const koa = require('koa');
const path = require('path');

const staticPath = './dist/static';

function start() {
    // koa
    const app = new koa();

    /* |--- Start of Middleware ---> */

    // Static
    app.use(koaStatic(path.join(__dirname, staticPath)));

    // Body Parser
    app.use(koaBodyParser());

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

    /* <--- End of Middleware ---| */

    return app;
}

module.exports = {
    start: start
};