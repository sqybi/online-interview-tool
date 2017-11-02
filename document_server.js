const config = require('./config');
const DocumentManager = require('./document_manager/documentManager');
const fs = require('fs');
const http = require('http');
const socket_io = require('socket.io');

const documentStoragePath = './documents';

function start(app) {
    // Document Manager
    if (!fs.existsSync(documentStoragePath)) {
        fs.mkdirSync(documentStoragePath);
    }
    const manager = new DocumentManager(documentStoragePath);

    setInterval(function () {
        manager.clean_up();
    }, config.document_manager_clean_up_interval_in_ms);

    // Create Socket.IO
    const server = http.Server(app.callback());
    const io = new socket_io(server);

    // Socket operations
    io.on('connection', function (socket) {
        let doc_id = null;
        let doc = null;

        socket.on('join', async function (data) {
            doc_id = data.doc_id;
            doc = await manager.get(doc_id);
            if (doc === null) {
                doc = await manager.add(doc_id);
            }
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
            io.sockets.emit('apply', {
                client_id: socket.id,
                event: data.event,
            });
        });
    });

    return server;
}

module.exports = {
    start: start
};