"use strict";
exports.__esModule = true;
exports.toCounterEventDto = exports.toCounterEvent = void 0;
function toCounterEvent(id, eventDto, counterName) {
    if (!eventDto) {
        return null;
    }
    return {
        id: id,
        counterName: counterName,
        newValue: eventDto.newValue,
        timestamp: eventDto.timestamp,
        type: eventDto.type
    };
}
exports.toCounterEvent = toCounterEvent;
function toCounterEventDto(event) {
    if (!event) {
        return null;
    }
    return {
        newValue: event.newValue,
        timestamp: event.timestamp,
        type: event.type
    };
}
exports.toCounterEventDto = toCounterEventDto;
