const router = require('koa-router')();
const controller = require('../controllers/doc');

// Routing: /d

module.exports =
    router
        .get('/', controller.new_doc)
        .get('doc', '/:doc_id', controller.get_doc);
