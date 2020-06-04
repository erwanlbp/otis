export type EventType = 'increment' | 'decrement';

export function getEventTypeIcon(type: EventType): string {
    switch (type) {
        case 'increment':
            return 'add';
        case 'decrement':
            return 'remove';
        default:
            return 'help';
    }
}

export function getEventTypeValue(type: EventType): number {
    switch (type) {
        case 'increment':
            return 1;
        case 'decrement':
            return -1;
        default:
            return 0;
    }
}
