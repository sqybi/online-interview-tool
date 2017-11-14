'use strict';

// '$' (jQuery), 'ace' and 'io' already imported
// 'doc_id' and 'server_port' already defined


// Functionality
var editor_start_sync = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        editor.setReadOnly(true);
                        updating = true;

                    case 2:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function editor_start_sync() {
        return _ref.apply(this, arguments);
    };
}();

var editor_stop_sync = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        updating = false;
                        editor.setReadOnly(false);

                    case 2:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    }));

    return function editor_stop_sync() {
        return _ref2.apply(this, arguments);
    };
}();

var editor_insert = function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(event) {
        var range;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        range = {
                            row: event.start.row,
                            column: event.start.column
                        };

                        console.log(range, event.lines.join('\n'));
                        _context3.next = 4;
                        return editor_session.insert(range, event.lines.join('\n'));

                    case 4:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, this);
    }));

    return function editor_insert(_x) {
        return _ref3.apply(this, arguments);
    };
}();

var editor_remove = function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(event) {
        var range;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        range = {
                            start: {
                                row: event.start.row,
                                column: event.start.column
                            },
                            end: {
                                row: event.end.row,
                                column: event.end.column
                            }
                        };

                        console.log(range);
                        _context4.next = 4;
                        return editor_session.remove(range);

                    case 4:
                    case 'end':
                        return _context4.stop();
                }
            }
        }, _callee4, this);
    }));

    return function editor_remove(_x2) {
        return _ref4.apply(this, arguments);
    };
}();

/* Options */

// Highlight Language Selector


function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var updating = false;
var connected = false;

/* Editor */

// Code completion tool
ace.require('/ace/ext/language_tools');

// Create editor
var editor = ace.edit('editor');
var editor_session = editor.getSession();

// Editor settings
editor.setReadOnly(true);
editor.setFontSize(16);
editor.$blockScrolling = Infinity;
editor_session.setTabSize(4);
editor_session.setUseSoftTabs(true);
editor_session.setUseWrapMode(true);var highlight_selector = $('#editor-highlight');
highlight_selector.on('change', function () {
    editor_session.setMode(highlight_selector.val());
});
editor_session.setMode(highlight_selector.val());

// Highlight Language Selector
var tab_size_selector = $('#editor-tab-size');
tab_size_selector.on('change', function () {
    editor_session.setTabSize(parseInt(tab_size_selector.val()));
});
editor_session.setMode(highlight_selector.val());

// Theme Selector
var theme_selector = $('#editor-theme');
theme_selector.on('change', function () {
    editor.setTheme(theme_selector.val());
});
editor.setTheme(theme_selector.val());

// Keymap Selector
var keymap_selector = $('#editor-keymap');
keymap_selector.on('change', function () {
    editor.setKeyboardHandler(keymap_selector.val());
});
editor.setKeyboardHandler(keymap_selector.val());

/* Socket.IO */

// Create socket
var socket = io(window.location.origin);

// Connected
socket.on('connect', function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(data) {
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        socket.emit('join', {
                            doc_id: doc_id
                        });
                        $('#disconnected-alert').css({ 'border-color': '#4390a3' }).height(0).find('span').html('CONNECTED!').css({ 'color': '#4390a3' });
                        $('#disconnected-alert .unhappyface').css({ 'display': 'none' });
                        $('#disconnected-alert .happyface').css({ 'display': 'inline-block' });
                        connected = true;
                        editor.setReadOnly(false);

                    case 6:
                    case 'end':
                        return _context5.stop();
                }
            }
        }, _callee5, this);
    }));

    return function (_x3) {
        return _ref5.apply(this, arguments);
    };
}());

// Connection lost
socket.on('disconnect', function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(data) {
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) {
                switch (_context6.prev = _context6.next) {
                    case 0:
                        editor.setReadOnly(true);
                        connected = false;
                        $('#disconnected-alert').css({ 'border-color': '#dc5d55' }).height(20).find('span').html("DISCONNECTED!").css({ 'color': '#dc5d55' });
                        $('#disconnected-alert .unhappyface').css({ 'display': 'inline-block' });
                        $('#disconnected-alert .happyface').css({ 'display': 'none' });

                    case 5:
                    case 'end':
                        return _context6.stop();
                }
            }
        }, _callee6, this);
    }));

    return function (_x4) {
        return _ref6.apply(this, arguments);
    };
}());

// Initialize document content
socket.on('refresh', function () {
    var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(data) {
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
            while (1) {
                switch (_context7.prev = _context7.next) {
                    case 0:
                        _context7.next = 2;
                        return editor_start_sync();

                    case 2:
                        editor_session.setValue(data.content_text);
                        _context7.next = 5;
                        return editor_stop_sync();

                    case 5:
                    case 'end':
                        return _context7.stop();
                }
            }
        }, _callee7, this);
    }));

    return function (_x5) {
        return _ref7.apply(this, arguments);
    };
}());

// Document changed
editor.on('change', function () {
    var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(event) {
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
            while (1) {
                switch (_context8.prev = _context8.next) {
                    case 0:
                        if (!updating) {
                            _context8.next = 2;
                            break;
                        }

                        return _context8.abrupt('return');

                    case 2:
                        if (event.action == 'remove') {
                            event.lines = [];
                        }
                        socket.emit('apply', {
                            event: event
                        });

                    case 4:
                    case 'end':
                        return _context8.stop();
                }
            }
        }, _callee8, this);
    }));

    return function (_x6) {
        return _ref8.apply(this, arguments);
    };
}());

// Other clients changed the document
socket.on('apply', function () {
    var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(data) {
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
            while (1) {
                switch (_context9.prev = _context9.next) {
                    case 0:
                        console.log(data.client_id, socket.id);

                        if (!(data.client_id == socket.id)) {
                            _context9.next = 3;
                            break;
                        }

                        return _context9.abrupt('return');

                    case 3:
                        _context9.next = 5;
                        return editor_start_sync();

                    case 5:
                        _context9.t0 = data.event.action;
                        _context9.next = _context9.t0 === 'insert' ? 8 : _context9.t0 === 'remove' ? 10 : 12;
                        break;

                    case 8:
                        editor_insert(data.event);
                        return _context9.abrupt('break', 13);

                    case 10:
                        editor_remove(data.event);
                        return _context9.abrupt('break', 13);

                    case 12:
                        console.log('Undefined document operation: ' + operation.action);

                    case 13:
                        _context9.next = 15;
                        return editor_stop_sync();

                    case 15:
                    case 'end':
                        return _context9.stop();
                }
            }
        }, _callee9, this);
    }));

    return function (_x7) {
        return _ref9.apply(this, arguments);
    };
}());
//# sourceMappingURL=main.js.map