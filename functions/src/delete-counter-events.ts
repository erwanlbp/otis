import * as functions from 'firebase-functions';
import * as admin from "firebase-admin";

export const deleteteCounterEvents = functions
    .region("europe-west1")
    .firestore.document('users/{userId}/counters/{counterId}')
    .onDelete((snapshot, context) => {
        const {userId, counterId} = context.params;
        return admin.firestore().collection(`users/${userId}/counters/${counterId}/events`).listDocuments()
            .then(docs => docs.forEach(doc => doc.delete()))
            .catch(err => console.log(err));
    });
