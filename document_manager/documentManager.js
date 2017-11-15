const Document = require('./document');
const config = require('../config');

function DocumentManager(base_path) {
    this.base_path = base_path;
    this.docs = [];
}

// Document Management

DocumentManager.prototype.create = async function (doc_id) {
    this.docs[doc_id] = new Document(doc_id);
    await this.docs[doc_id].save(this.base_path);
    return this.docs[doc_id];
};


DocumentManager.prototype.load = async function (doc_id) {
    this.docs[doc_id] = new Document(doc_id);
    const result = await this.docs[doc_id].load(this.base_path);
    if (result) {
        return this.docs[doc_id];
    } else {
        delete this.docs[doc_id];
        return null;
    }
};

// Remove from memory
DocumentManager.prototype.remove = async function (doc_id) {
    if (doc_id in this.docs) {
        await this.docs[doc_id].save(this.base_path);
        delete this.docs[doc_id];
    }
};

// Delete from disk
DocumentManager.prototype.delete = async function (doc_id) {
    if (doc_id in this.docs) {
        await this.docs[doc_id].delete();
        delete this.docs[doc_id];
    }
};

DocumentManager.prototype.get = async function (doc_id) {
    if (!(doc_id in this.docs)) {
        return null;
    } else {
        return this.docs[doc_id];
    }
};

DocumentManager.prototype.get_or_load = async function (doc_id) {
    let doc = await this.get(doc_id);
    if (doc === null) {
        doc = await this.load(doc_id);
    }
    return doc;
};

// Memory Management

DocumentManager.prototype.clean_up = async function () {
    const current_time = new Date();
    let saved_docs = 0;
    let cleaned_docs = 0;
    for (const doc_id in this.docs) {
        if (await this.docs[doc_id].save(this.base_path)) {
            saved_docs++;
        }
        if (current_time - this.docs[doc_id].last_visit > config.document_manager_timeout_in_ms) {
            this.remove(doc_id);
            cleaned_docs++;
        }
    }
    console.log('[Document Manager] ' + saved_docs + ' saved; ' + cleaned_docs + ' removed.');
};

// Exports
module.exports = DocumentManager;