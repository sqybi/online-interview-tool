const config = require('../config');
const document_server = require('../document_server');
const doc_content_generator = require('../utils/doc_content_generator');
const ejs = require('ejs');

let re = /^[a-zA-Z0-9\-]{1,20}$/;
re.compile(re);

module.exports = {
    post_create: async function (ctx, next) {
        let doc = await document_server.create();
        if (doc !== null) {
            const content = await doc_content_generator.generate(ctx.request.body);
            await doc.setText(content);
            ctx.redirect(ctx.router.url('doc', doc.id));
        } else {
            ctx.status = 404;
        }
    },

    get_doc: async function (ctx, next) {
        let doc_id = ctx.params.doc_id;
        if (await re.test(doc_id)) {
            if (await document_server.check(doc_id)) {
                ejs.renderFile('./views/doc.ejs', {
                    doc_id: doc_id,
                    server_port: config.http_server_listen_port,
                }, function (err, str) {
                    if (err) {
                        ctx.status = 500;
                        ctx.body = {err_str: err};
                    } else {
                        ctx.status = 200;
                        ctx.body = str;
                    }
                });
            } else {
                ctx.status = 404;
            }
        } else {
            ctx.status = 404;
        }
    }
};