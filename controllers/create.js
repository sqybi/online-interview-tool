const router = require('koa-router')();
const ejs = require('ejs');

module.exports = {
    get_create: async function (ctx, next) {
        ejs.renderFile('./views/create.ejs', {}, function (err, str) {
            if (err) {
                ctx.status = 500;
                ctx.body = {err_str: err};
            } else {
                ctx.status = 200;
                ctx.body = str;
            }
        });
    }
}