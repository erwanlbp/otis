export interface CounterEvent {
    id?: string;
    counterName: string;
    timestamp: number;
    newValue: number;
    type: string;
}

export interface CounterEventFirebaseDto {
    timestamp: number;
    newValue: number;
    type: string;
}

export function toCounterEvent(id: string, eventDto: CounterEventFirebaseDto, counterName: string): CounterEvent {
    if (!eventDto) {
        return null;
    }
    return {
        id,
        counterName,
        newValue: eventDto.newValue,
        timestamp: eventDto.timestamp,
        type: eventDto.type,
    };
}

export function toCounterEventDto(event: CounterEvent): CounterEventFirebaseDto {
    if (!event) {
        return null;
    }
    return {
        newValue: event.newValue,
        timestamp: event.timestamp,
        type: event.type,
    };
}
