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

export function getEventTypeValue(type: EventType, value?: number): number {
  switch (type) {
    case 'increment':
      return value || 1;
    case 'decrement':
      return value || -1;
    default:
      return 0;
  }
}

/**
 * @param value must be != 0
 */
export function getEventType(value: number): EventType {
  return value > 0 ? 'increment' : 'decrement';
}
