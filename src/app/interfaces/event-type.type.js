"use strict";
exports.__esModule = true;
exports.getEventTypeValue = exports.getEventTypeIcon = void 0;
function getEventTypeIcon(type) {
    switch (type) {
        case 'increment':
            return 'add';
        case 'decrement':
            return 'remove';
        default:
            return 'help';
    }
}
exports.getEventTypeIcon = getEventTypeIcon;
function getEventTypeValue(type) {
    switch (type) {
        case 'increment':
            return 1;
        case 'decrement':
            return -1;
        default:
            return 0;
    }
}
exports.getEventTypeValue = getEventTypeValue;
