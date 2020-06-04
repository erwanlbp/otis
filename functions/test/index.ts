import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as insertEvent from './insert-counter-events';
import { random } from './utils';

admin.initializeApp(functions.config().firebase);

const userId = random();
const counterId = random();

const ts1 = new Date(2020, 1, 1);
const ts2 = new Date(2020, 1, 2);
const ts3 = new Date(2020, 1, 2);
insertEvent.insertEvents(userId, counterId, null, null, ts1.getTime());
insertEvent.insertEvents(userId, counterId, null, null, ts2.getTime());
insertEvent.insertEvents(userId, counterId, null, null, ts3.getTime());
