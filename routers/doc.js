const router = require('koa-router')();
const controller = require('../controllers/doc');

// Routing: /d

module.exports =
    router
        .post('/__create', controller.post_create)
        .get('doc', '/:doc_id', controller.get_doc);
