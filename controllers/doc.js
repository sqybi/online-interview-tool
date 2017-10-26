const ejs = require('ejs');

let re = /^[a-zA-Z0-9\-]{1,20}$/;
re.compile(re);

module.exports = {
    new_doc: async function new_doc(ctx, next) {
        let doc_id = 'test0001';
        ctx.redirect(ctx.router.url('doc', doc_id));
    },

    get_doc: async function get_doc(ctx, next) {
        let doc_id = ctx.params.doc_id;
        if (re.test(doc_id)) {
            ejs.renderFile('./views/doc.ejs', {doc_id: doc_id}, function (err, str) {
                if (err) {
                    ctx.status = 500;
                    ctx.body = {err_str: err};
                } else {
                    ctx.status = 200;
                    ctx.body = str;
                }
            });
        } else {
            ctx.status = 500;
            ctx.body = {err_str: 'Wrong doc id format, only A-Z, a-z, 0-9 and character "-" allowed.'};
        }
    }
}