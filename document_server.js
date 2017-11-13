const config = require('./config');
const DocumentManager = require('./document_manager/documentManager');
const doc_id_generator = require('./utils/doc_id_generator');
const fs = require('fs');
const http = require('http');
const socket_io = require('socket.io');

const documentStoragePath = './documents';

// Document Manager
if (!fs.existsSync(documentStoragePath)) {
    fs.mkdirSync(documentStoragePath);
}
const manager = new DocumentManager(documentStoragePath);

setInterval(function () {
    manager.clean_up();
}, config.document_manager_clean_up_interval_in_ms);


function start(app) {
    // Create Socket.IO
    const server = http.Server(app.callback());
    const io = new socket_io(server);

    const sockets_list_by_doc_id = [];

    // Socket operations
    io.on('connection', function (socket) {
        let doc_id = null;
        let doc = null;

        socket.on('join', async function (data) {
            doc_id = data.doc_id;
            doc = await manager.get(doc_id);
            if (doc === null) {
                doc = await manager.load(doc_id);
            }
            if (!(doc_id in sockets_list_by_doc_id)) {
                sockets_list_by_doc_id[doc_id] = [];
            }
            sockets_list_by_doc_id[doc_id][socket.id] = socket;
            socket.emit('refresh', {
                content_text: await doc.getText(),
            })
        });

        socket.on('pull', async function (data) {
            socket.emit('refresh', {
                content_text: await doc.getText(),
            });
        });

        socket.on('apply', async function (data) {
            if (doc === null) {
                console.log('Need reconnection from client ' + socket.id + '.');
            }
            await doc.apply(data.event);
            for (let socket_id in sockets_list_by_doc_id[doc_id]) {
                sockets_list_by_doc_id[doc_id][socket_id].emit('apply', {
                    client_id: socket.id,
                    event: data.event,
                });
            }
        });

        socket.on('disconnect', async function (data) {
            if (doc_id === null) {
                return;
            }
            if (doc_id in sockets_list_by_doc_id) {
                if (socket.id in sockets_list_by_doc_id[doc_id]) {
                    delete sockets_list_by_doc_id[doc_id][socket.id];
                }
            }
        });
    });

    return server;
}

async function create_new_doc() {
    const doc_id = await doc_id_generator.generate(manager);
    return await manager.create(doc_id);
}

async function check_doc_id_existence(doc_id) {
    const doc = await manager.get_or_load(doc_id);
    return doc !== null;
}

module.exports = {
    start: start,
    create: create_new_doc,
    check: check_doc_id_existence,
};