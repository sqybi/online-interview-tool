'use strict';

// '$' (jQuery), 'ace' and 'io' already imported
// 'doc_id' and 'server_port' already defined


let updating = false;
let connected = false;


/* Editor */

// Code completion tool
ace.require('/ace/ext/language_tools');

// Create editor
const editor = ace.edit('editor');
const editor_session = editor.getSession();

// Editor settings
editor.setReadOnly(true);
editor.setFontSize(16);
editor.$blockScrolling = Infinity;
editor_session.setTabSize(4);
editor_session.setUseSoftTabs(true);
editor_session.setUseWrapMode(true);

// Functionality
async function editor_start_sync() {
    editor.setReadOnly(true);
    updating = true;
}

async function editor_stop_sync() {
    updating = false;
    editor.setReadOnly(false);
}

async function editor_insert(event) {
    const range = {
        row: event.start.row,
        column: event.start.column,
    };
    console.log(range, event.lines.join('\n'));
    await editor_session.insert(range, event.lines.join('\n'));
}

async function editor_remove(event) {
    const range = {
        start: {
            row: event.start.row,
            column: event.start.column,
        },
        end: {
            row: event.end.row,
            column: event.end.column,
        },
    }
    console.log(range);
    await editor_session.remove(range);
}


/* Options */

// Highlight Language Selector
const highlight_selector = $('#editor-highlight');
highlight_selector.on('change', function () {
    editor_session.setMode(highlight_selector.val());
});
editor_session.setMode(highlight_selector.val());

// Theme Selector
const theme_selector = $('#editor-theme');
theme_selector.on('change', function () {
    editor.setTheme(theme_selector.val());
});
editor.setTheme(theme_selector.val());

// Keymap Selector
const keymap_selector = $('#editor-keymap');
keymap_selector.on('change', function () {
    editor.setKeyboardHandler(keymap_selector.val());
});
editor.setKeyboardHandler(keymap_selector.val());

/* Socket.IO */

// Create socket
const socket = io(window.location.origin);

// Connected
socket.on('connect', async function (data) {
    socket.emit('join', {
        doc_id: doc_id
    });
    $('#disconnected-alert').css({'border-color':'#4390a3'}).height(0).find('span').html('CONNECTED').css({'color':'#4390a3'});
    $('#disconnected-alert .unhappyface').css({'display':'none'});
    $('#disconnected-alert .happyface').css({'display':'inline-block'});
    connected = true;
    editor.setReadOnly(false);
});

// Connection lost
socket.on('disconnect', async function (data) {
    editor.setReadOnly(true);
    connected = false;
    $('#disconnected-alert').css({'border-color':'#dc5d55'}).height(20).find('span').html("DISCONNECTED").css({'color':'#dc5d55'});
    $('#disconnected-alert .unhappyface').css({'display':'inline-block'});
    $('#disconnected-alert .happyface').css({'display':'none'});
});

// Initialize document content
socket.on('refresh', async function (data) {
    await editor_start_sync();
    editor_session.setValue(data.content_text);
    await editor_stop_sync();
});

// Document changed
editor.on('change', async function (event) {
    if (updating) {
        return;
    }
    if (event.action == 'remove') {
        event.lines = [];
    }
    socket.emit('apply', {
        event: event,
    });
});

// Other clients changed the document
socket.on('apply', async function (data) {
    console.log(data.client_id, socket.id);
    if (data.client_id == socket.id) {
        return;
    }
    await editor_start_sync();
    switch (data.event.action) {
        case 'insert':
            editor_insert(data.event);
            break;
        case 'remove':
            editor_remove(data.event);
            break;
        default:
            console.log('Undefined document operation: ' + operation.action);
    }
    await editor_stop_sync();
});
