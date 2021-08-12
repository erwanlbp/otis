import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as deleteCounter from './delete-counter';
import * as deleteTag from './delete-tag';
import * as deleteTimeCounterEvent from './delete-time-counter-events';

admin.initializeApp(functions.config().firebase);

export { deleteCounter, deleteTimeCounterEvent, deleteTag };
