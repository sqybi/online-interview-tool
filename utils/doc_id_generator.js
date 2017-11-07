const config = require('../config');

const available_characters = "abcdefghijkmnpqrstuvwxyz23456789";

async function generate_random_available_character () {
    const index = Math.floor(Math.random() * available_characters.length);
    return available_characters[index];
}

async function generate_random_string (length) {
    let s = "";
    for (let i = 0; i < length; i++) {
        s += await generate_random_available_character();
    }
    return s;
}

module.exports = {
    generate: async function (manager) {
        let doc_id = "";
        while (doc_id === "" || await manager.get(doc_id) !== null) {
            doc_id = await generate_random_string(config.doc_id_length);
        }
        return doc_id;
    }
};