const util = require('util');
const Koa = require('koa');
const router = require('./routers/index');
const app = new Koa();


/* Middleware */

// Logging
app.use(async (ctx, next) => {
    let start_time = new Date();
    try {
        await next();
    } catch (err) {
        ctx.body = { message: err.message };
        ctx.status = err.status || 500;
    }
    let time_passed = new Date() - start_time;
    console.log(util.format('[%s %s] process time: %d ms, status code: %d', ctx.method, ctx.url, time_passed, ctx.status));
});

// Router
app.use(router.routes()).use(router.allowedMethods()).use(async (ctx, next) => {console.log('test')});


/* Start server */
app.listen(8001);
