import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const func = functions
    .region('europe-west1')
    .firestore.document('users/{userId}/time-counters/{counterId}')
    .onDelete((snapshot, context) => {
        const { userId, counterId } = context.params;

        return admin.firestore()
            .collection(`users/${userId}/time-counters/${counterId}/events`)
            .listDocuments()
            .then(docs => Promise.all(docs.map(async doc => await doc.delete())))
            .catch(err => console.log(err));
    });
