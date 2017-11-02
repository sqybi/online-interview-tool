const config = require('./config');
const document_server = require('./document_server');
const web_server = require('./web_server');

// Prepare servers
const app = web_server.start();
const server = document_server.start(app);

// Start listening
server.listen(config.http_server_listen_port, config.http_server_listen_addr);