import { EventType, getEventTypeValue } from './event-type.type';

export interface CounterEvent {
    id?: string;
    counterName: string;
    timestamp: number;
    newValue: number;
    type: EventType;
    value?: number;
}

export interface CounterEventFirebaseDto {
    timestamp: number;
    newValue: number;
    type: EventType;
    value?: number;
}

export function toCounterEvent(id: string, eventDto: CounterEventFirebaseDto, counterName: string): CounterEvent | null {
    if (!eventDto) {
        return null;
    }
    return {
        id,
        counterName,
        newValue: eventDto.newValue,
        timestamp: eventDto.timestamp,
        type: eventDto.type,
        value: getEventTypeValue(eventDto.type, eventDto.value),
    };
}

export function toCounterEventDto(event: CounterEvent): CounterEventFirebaseDto | null {
    if (!event) {
        return null;
    }
    const ev: CounterEventFirebaseDto = {
        newValue: event.newValue,
        timestamp: event.timestamp,
        type: event.type,
        value: event.value,
    };
    if (!event.value || (event.value && Math.abs(event.value) === 1)) {
        delete ev.value;
    }
    return ev;
}
