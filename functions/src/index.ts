import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as deleteCounterEvent from './delete-counter-events';
import * as aggregateMonthlyCounterEvents from './aggregate-monthly-counter-events';
import * as deleteTimeCounterEvent from './delete-time-counter-events';

admin.initializeApp(functions.config().firebase);

export { deleteCounterEvent, deleteTimeCounterEvent, aggregateMonthlyCounterEvents };
