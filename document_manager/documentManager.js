const Document = require('./document');
const config = require('../config');

function DocumentManager(base_path) {
    this.base_path = base_path;
    this.docs = [];
    setInterval(this.clean_up, config.document_manager_clean_up_interval_in_ms);
}

// Document Management

DocumentManager.prototype.add = async function(doc_id) {
    this.docs[doc_id] = new Document(doc_id);
    await this.docs[doc_id].load(this.base_path);
};

DocumentManager.prototype.remove = async function(doc_id) {
    if (doc_id in this.docs) {
        await this.docs[doc_id].save(this.base_path);
        delete this.docs[doc_id];
    }
};

DocumentManager.prototype.delete = async function(doc_id) {
    if (doc_id in this.docs) {
        await this.docs[doc_id].delete();
        delete this.docs[doc_id];
    }
};

DocumentManager.prototype.get = async function(doc_id) {
    if (!(doc_id in this.docs)) {
        return null;
    } else {
        return this.docs[doc_id];
    }
};

// Memory Management

DocumentManager.prototype.clean_up = function() {
    const current_time = new Date();
    for (let doc_id in this.docs) {
        this.docs[doc_id].save(this.base_path);
        if (current_time - this.docs[doc_id].last_visit > config.document_manager_timeout_in_ms) {
            this.remove(doc_id);
        }
    }
};

// Exports
module.exports.DocumentManager = DocumentManager;