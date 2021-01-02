import * as admin from 'firebase-admin';
import { CounterEventFirebaseDto } from '../../src/app/interfaces/counter-event.interface';
import { EventType } from '../../src/app/interfaces/event-type.type';
import { random } from './utils';

export function insertEvents(
  userId: string = random(),
  counterId: string = random(),
  eventId: string = random(),
  type: EventType = 'increment',
  timestamp?: number,
): Promise<any> {
  const event: CounterEventFirebaseDto = {
    type,
    timestamp: timestamp || new Date().getTime(),
    newValue: 4,
  };
  return admin.firestore().doc(`users/${userId}/counters/${counterId}/events/${eventId}`).set(event);
}
