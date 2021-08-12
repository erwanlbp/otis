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

    const deleteCounterTags = admin
      .firestore()
      .collection(`users/${userId}/counters-tags`)
      .where('counter', '==', counterId)
      .get()
      .then(docs => {
        const promises: Promise<any>[] = [];
        docs.forEach(doc => promises.push(admin.firestore().doc(`users/${userId}/counters-tags/${doc.id}`).delete()));
        return Promise.all(promises);
      });

    return Promise.all([deleteCounterEvents, deleteCounterMonthlyEvents, deleteCounterTags]).catch(err => console.log(err));
  });
