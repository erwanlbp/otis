import * as admin from 'firebase-admin';
import * as _ from 'underscore';
import { CounterEventFirebaseDto } from '../../src/app/interfaces/counter-event.interface';
import { CounterMonthlyEventsAggregation } from '../../src/app/interfaces/counter-monthly-events-aggregation.interface';
import { getEventTypeValue } from '../../src/app/interfaces/event-type.type';
import * as moment from 'moment';

function getMonthDate(timestamp: number): number {
  return moment(timestamp).utc().startOf('month').startOf('day').valueOf();
}

const serviceAccount = require('./otis-count-firebase-adminsdk-d3q9t-628c996b45.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin
  .firestore()
  .collection('users')
  .listDocuments()
  .then(async users => {
    for (const user of users) {
      console.log(`> user ${user.id}`);
      if (user.id === 'WMkXre8Ew7OYPbGDT8izigSr40e2') continue;
      await user
        .collection('counters')
        .listDocuments()
        .then(async counters => {
          for (const counter of counters) {
            console.log(`>> counter ${counter.id}`);
            console.log('>> deleting older months agg');
            await admin
              .firestore()
              .collection(`users/${user.id}/counters/${counter.id}/agg-monthly-events`)
              .listDocuments()
              .then(async existing => {
                for (const month of existing) await month.delete();
              });
            await counter
              .collection('events')
              .listDocuments()
              .then(async evs => {
                const events = await Promise.all(evs.map(ev => ev.get()));
                const monthlyEvents: { [monthTs: number]: CounterEventFirebaseDto[] } = _.groupBy(
                  events.map(event => event.data()),
                  (event: CounterEventFirebaseDto) => getMonthDate(event.timestamp),
                );
                for (const [month, monthEvents] of Object.entries(monthlyEvents)) {
                  console.log(`>>> month ${month}`);
                  const counterMonthlyEventsAggregation: CounterMonthlyEventsAggregation = {
                    month: Number(month),
                    totalCount: monthEvents.map(e => getEventTypeValue(e.type)).reduce((a, b) => a + b, 0),
                  };
                  await admin
                    .firestore()
                    .doc(`users/${user.id}/counters/${counter.id}/agg-monthly-events/${month}`)
                    .set(counterMonthlyEventsAggregation);
                }
              });
          }
        });
    }
  });
