const config = require('../config');
const fs = require('fs');
const path = require('path');

function Document(id) {
    this.id = id;
    this.operations = [];
    this.current_content = [''];
    this.last_visit = new Date();
}

// Public

Document.prototype.apply = async function (operation) {
    if (operation.start.row > operation.end.row && operation.start.column > operation.end.column) {
        throw 'Document operation contains negative number of characters';
    }
    switch (operation.action) {
        case 'insert':
            await this.insert(operation);
            break;
        case 'remove':
            await this.remove(operation);
            break;
        default:
            throw 'Undefined document operation: ' + operation.action;
    }
    await this.append_operation(operation);
    this.last_visit = new Date();
};

Document.prototype.save = async function (base_path) {
    let operations_path = path.join(base_path, this.id + '.operations.json');
    let content_path = path.join(base_path, this.id + '.content.json');
    let operations_json = JSON.stringify(this.operations);
    let content_json = JSON.stringify(this.current_content);
    fs.writeFileSync(operations_path, operations_json);
    fs.writeFileSync(content_path, content_json);
};

Document.prototype.load = async function (base_path) {
    let operations_path = path.join(base_path, this.id + '.operations.json');
    let content_path = path.join(base_path, this.id + '.content.json');
    let operations_json = fs.existsSync(operations_path) ? fs.readFileSync(operations_path) : '[""]';
    let content_json = fs.existsSync(content_path) ? fs.readFileSync(content_path) : '[""]';
    this.operations = JSON.parse(operations_json);
    this.current_content = JSON.parse(content_json);
    if (!Array.isArray(this.operations)) {
        this.operations = [];
    }
    if (!Array.isArray(this.current_content) || this.current_content.length === 0) {
        this.current_content = [''];
    }
};

Document.prototype.delete = async function (base_path) {
    let operations_path = path.join(base_path, this.id + '.operations.json');
    let content_path = path.join(base_path, this.id + '.content.json');
    if (fs.existsSync(operations_path)) {
        fs.unlinkSync(operations_path);
    }
    if (fs.existsSync(content_path)) {
        fs.unlinkSync(content_path);
    }
};

Document.prototype.getContent = async function () {
    return this.current_content;
};

Document.prototype.getText = async function () {
    return this.current_content.join('\n');
};

Document.prototype.setText = async function (content_text) {
    this.current_content = content_text.split('\n');
};

// Private

Document.prototype.insert = async function (operation) {
    let lines = operation.lines.slice();
    let s_row = operation.start.row;
    let s_col = operation.start.column;
    if (s_row >= this.current_content.length) {
        this.current_content.push('');
    }
    let origin_data_first_half = this.current_content[s_row].slice(0, s_col);
    let origin_data_second_half = this.current_content[s_row].slice(s_col);

    lines[0] = origin_data_first_half + lines[0];
    lines[lines.length - 1] = lines[lines.length - 1] + origin_data_second_half;
    this.current_content.splice(s_row, 1);
    for (let i = lines.length - 1; i >= 0; --i) {
        this.current_content.splice(s_row, 0, lines[i]);
    }
};

Document.prototype.remove = async function (operation) {
    let s_row = operation.start.row;
    let s_col = operation.start.column;
    let e_row = operation.end.row;
    let e_col = operation.end.column;

    this.current_content[s_row] = this.current_content[s_row].slice(0, s_col) + this.current_content[e_row].slice(e_col);
    this.current_content.splice(s_row + 1, e_row - s_row);
};

Document.prototype.append_operation = async function (operation) {
    this.operations.push(operation);
    if (this.operations.length > config.max_operations_stored) {
        this.operation.splice(0, this.operations.length - config.max_operations_stored);
    }
    // TODO: Save content before first operation to replay. Need a function to apply operation on content.
};

// Exports
module.exports = Document;