import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection, QueryFn } from '@angular/fire/firestore';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { TimeCounterEvent, toTimeCounterEvent, toTimeCounterEventDto } from '../interfaces/time-counter-event.interface';

@Injectable({
    providedIn: 'root',
})
export class TimeCounterEventService {
    constructor(
        private firestore: AngularFirestore,
        private authService: AuthService,
    ) {
    }

    userTimeCounterEventsDocument$(name: string, queryFunc?: QueryFn): Observable<AngularFirestoreCollection<TimeCounterEvent>> {
        return this.authService.getUserId$().pipe(
            map(userId => {
                if (!userId) {
                    return null;
                }
                return this.firestore.collection<TimeCounterEvent>(`users/${userId}/time-counters/${name}/events`, queryFunc);
            }),
        );
    }

    /**
     * eventId is used only for updating, it's the primary key of the event
     */
    saveCounterEvent(event: TimeCounterEvent, eventId?: string): Promise<void> {
        return this.userTimeCounterEventsDocument$(event.timeCounterName)
            .pipe(
                take(1),
                switchMap(doc => doc.doc(eventId || String(event.startTimestamp)).set(toTimeCounterEventDto(event))),
                tap(() => (event.id = eventId || String(event.startTimestamp))),
            )
            .toPromise();
    }

    deleteTimeCounterEvent(timeCounterName: string, id: string): Promise<void> {
        return this.userTimeCounterEventsDocument$(timeCounterName)
            .pipe(
                take(1),
                switchMap(doc => doc.doc<TimeCounterEvent>(id).delete()),
            ).toPromise();
    }

    fetchAllCounterEvents$(timeCounterName: string): Observable<TimeCounterEvent[]> {
        return this.userTimeCounterEventsDocument$(timeCounterName).pipe(
            switchMap(collection => collection.snapshotChanges()),
            map(events => (!events ? [] : events.map(event => toTimeCounterEvent(event.payload.doc.id, event.payload.doc.data(), timeCounterName)))),
        );
    }

    fetchChunkTimeCounterEvents$(timeCounterName: string, chunkSize: number, lastEventStartTs: number = null): Observable<TimeCounterEvent[]> {
        return this.userTimeCounterEventsDocument$(timeCounterName, ref => {
            let newRef = ref.orderBy('startTimestamp', 'desc');
            if (lastEventStartTs != null) {
                newRef = newRef.startAfter(lastEventStartTs);
            }
            return newRef.limit(chunkSize);
        }).pipe(
            switchMap(collection => collection.snapshotChanges()),
            map(events => (!events ? [] : events.map(event => toTimeCounterEvent(event.payload.doc.id, event.payload.doc.data(), timeCounterName)))),
        );
    }
}
