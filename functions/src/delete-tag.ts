import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const func = functions
  .region('europe-west1')
  .firestore.document('users/{userId}/tags/{tagId}')
  .onDelete((snapshot, context) => {
    const { userId, tagId } = context.params;

    const deleteCounterTags = admin
      .firestore()
      .collection(`users/${userId}/counters-tags`)
      .where('tag', '==', tagId)
      .get()
      .then(docs => {
        const promises: Promise<any>[] = [];
        docs.forEach(doc => promises.push(admin.firestore().doc(`users/${userId}/counters-tags/${doc.id}`).delete()));
        return Promise.all(promises);
      });

    return Promise.all([deleteCounterTags]).catch(err => console.log(err));
  });
