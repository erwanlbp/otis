import * as moment from 'moment';

export interface TimeCounterEvent {
  id?: string;
  timeCounterName: string;
  startTimestamp: number;
  endTimestamp: number;
}

export interface TimeCounterEventFirebaseDto {
  startTimestamp: number;
  endTimestamp: number;
}

export function toTimeCounterEvent(id: string, eventDto: TimeCounterEventFirebaseDto, timeCounterName: string): TimeCounterEvent | null {
  if (!eventDto) {
    return null;
  }
  return {
    id,
    timeCounterName,
    startTimestamp: eventDto.startTimestamp,
    endTimestamp: eventDto.endTimestamp,
  };
}

export function toTimeCounterEventDto(event: TimeCounterEvent): TimeCounterEventFirebaseDto | null {
  if (!event) {
    return null;
  }
  return {
    startTimestamp: event.startTimestamp,
    endTimestamp: event.endTimestamp,
  };
}

export function generateRandomTimeCounterEvent(
  timeCounterName: string,
  startDate: moment.Moment,
  durationSeconds: number,
): TimeCounterEvent {
  const startTimestamp = startDate.toDate().getTime();
  return {
    timeCounterName,
    startTimestamp,
    endTimestamp: startDate.add(durationSeconds, 'seconds').toDate().getTime(),
    id: String(startTimestamp),
  };
}
