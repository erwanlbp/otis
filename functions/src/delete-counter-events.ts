import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const func = functions
  .region('europe-west1')
  .firestore.document('users/{userId}/counters/{counterId}')
  .onDelete((snapshot, context) => {
    const { userId, counterId } = context.params;

    const deleteCounterEvents = admin
      .firestore()
      .collection(`users/${userId}/counters/${counterId}/events`)
      .listDocuments()
      .then(docs => Promise.all(docs.map(async doc => await doc.delete())));

    const deleteCounterMonthlyEvents = admin
      .firestore()
      .collection(`users/${userId}/counters/${counterId}/agg-monthly-events`)
      .listDocuments()
      .then(docs => Promise.all(docs.map(async doc => await doc.delete())));

    return Promise.all([deleteCounterEvents, deleteCounterMonthlyEvents]).catch(err => console.log(err));
  });
