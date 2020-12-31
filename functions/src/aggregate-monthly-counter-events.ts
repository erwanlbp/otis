import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { CounterEventFirebaseDto } from '../../src/app/interfaces/counter-event.interface';
import { CounterMonthlyEventsAggregation } from '../../src/app/interfaces/counter-monthly-events-aggregation.interface';
import { getEventTypeValue } from '../../src/app/interfaces/event-type.type';

export const onCreate = functions
    .region('europe-west1')
    .firestore.document('users/{userId}/counters/{counterId}/events/{eventId}')
    .onCreate((snapshot, context) => {
        const { userId, counterId } = context.params;
        const eventSaved = snapshot.data() as CounterEventFirebaseDto;
        console.log('event:', eventSaved);
        const eventMonth = getMonthDate(eventSaved.timestamp);
        const monthlyAggregatePath = `users/${userId}/counters/${counterId}/agg-monthly-events/${eventMonth.getTime()}`;
        return admin
            .firestore()
            .doc(monthlyAggregatePath)
            .get()
            .then(monthlyAggregate => {
                if (!monthlyAggregate.exists) {
                    return saveNewMonthlyAgg(monthlyAggregatePath, eventMonth, eventSaved);
                }
                const existingAggregate = monthlyAggregate.data() as CounterMonthlyEventsAggregation;
                const updatedAggregation: Partial<CounterMonthlyEventsAggregation> = { totalCount: existingAggregate.totalCount + getEventTypeValue(eventSaved.type, eventSaved.value) };
                return admin.firestore().doc(monthlyAggregatePath).update(updatedAggregation);
            })
            .catch(err => console.error(err));
    });

export const onDelete = functions
    .region('europe-west1')
    .firestore.document('users/{userId}/counters/{counterId}/events/{eventId}')
    .onDelete((snapshot, context) => {
        const { userId, counterId } = context.params;
        const eventSaved = snapshot.data() as CounterEventFirebaseDto;
        console.log('event:', eventSaved);
        const eventMonth = getMonthDate(eventSaved.timestamp);
        const monthlyAggregatePath = `users/${userId}/counters/${counterId}/agg-monthly-events/${eventMonth.getTime()}`;
        return admin
            .firestore()
            .doc(monthlyAggregatePath)
            .get()
            .then(monthlyAggregate => {
                const existingAggregate = monthlyAggregate.data() as CounterMonthlyEventsAggregation;
                const updatedAggregation: Partial<CounterMonthlyEventsAggregation> = { totalCount: existingAggregate.totalCount - getEventTypeValue(eventSaved.type, eventSaved.value) };
                return admin.firestore().doc(monthlyAggregatePath).update(updatedAggregation);
            })
            .catch(err => console.error(err));
    });

export const onUpdate = functions
    .region('europe-west1')
    .firestore.document('users/{userId}/counters/{counterId}/events/{eventId}')
    .onUpdate((change, context) => {
        const { userId, counterId } = context.params;

        const before = change.before.data() as CounterEventFirebaseDto;
        const after = change.after.data() as CounterEventFirebaseDto;
        const beforeMonth = getMonthDate(before.timestamp);
        const afterMonth = getMonthDate(after.timestamp);

        console.log('before ::', before);
        console.log('after ::', after);

        if (beforeMonth.getTime() === afterMonth.getTime()) {
            console.log('Same month, nothing to do');
            return Promise.resolve();
        }

        const beforeMonthlyAggregatePath = `users/${userId}/counters/${counterId}/agg-monthly-events/${beforeMonth.getTime()}`;
        const updateBeforeMonthlyAgg = admin
            .firestore()
            .doc(beforeMonthlyAggregatePath)
            .get()
            .then(monthlyAggregate => {
                const existingAggregate = monthlyAggregate.data() as CounterMonthlyEventsAggregation;
                const updatedAggregation: Partial<CounterMonthlyEventsAggregation> = { totalCount: existingAggregate.totalCount - getEventTypeValue(before.type, before.value) };
                return admin.firestore().doc(beforeMonthlyAggregatePath).update(updatedAggregation);
            });

        const afterMonthlyAggregatePath = `users/${userId}/counters/${counterId}/agg-monthly-events/${afterMonth.getTime()}`;
        const updateAfterMonthlyAgg = admin
            .firestore()
            .doc(afterMonthlyAggregatePath)
            .get()
            .then(monthlyAggregate => {
                if (!monthlyAggregate.exists) {
                    return saveNewMonthlyAgg(afterMonthlyAggregatePath, afterMonth, after);
                }
                const existingAggregate = monthlyAggregate.data() as CounterMonthlyEventsAggregation;
                const updatedAggregation: Partial<CounterMonthlyEventsAggregation> = { totalCount: existingAggregate.totalCount + getEventTypeValue(after.type, after.value) };
                return admin.firestore().doc(afterMonthlyAggregatePath).update(updatedAggregation);
            });

        return Promise.all([updateBeforeMonthlyAgg, updateAfterMonthlyAgg]).catch(err => console.error(err));
    });

function getMonthDate(timestamp: number): Date {
    const month = new Date(timestamp);
    month.setDate(1);
    month.setHours(0);
    month.setMinutes(0);
    month.setSeconds(0);
    month.setMilliseconds(0);
    return month;
}

function saveNewMonthlyAgg(path: string, month: Date, event: CounterEventFirebaseDto): Promise<any> {
    const counterMonthlyEventsAggregation: CounterMonthlyEventsAggregation = {
        totalCount: getEventTypeValue(event.type),
        month: month.getTime(),
    };
    return admin.firestore().doc(path).create(counterMonthlyEventsAggregation);
}
