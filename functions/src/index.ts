import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as deleteCounterEvent from './delete-counter-events';
import * as aggregateMonthlyCounterEvents from './aggregate-monthly-counter-events';

admin.initializeApp(functions.config().firebase);

export { deleteCounterEvent, aggregateMonthlyCounterEvents };
