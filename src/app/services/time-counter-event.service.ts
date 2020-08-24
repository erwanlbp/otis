import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection, QueryFn } from '@angular/fire/firestore';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { generateRandomTimeCounterEvent, TimeCounterEvent, toTimeCounterEvent, toTimeCounterEventDto } from '../interfaces/time-counter-event.interface';
import * as moment from 'moment';
import { UtilsService } from './utils.service';

@Injectable({
    providedIn: 'root',
})
export class TimeCounterEventService {
    constructor(
        private firestore: AngularFirestore,
        private authService: AuthService,
        private utilsService: UtilsService,
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

    updateEventTimestamps(timeCounterName: string, eventId: string, newStartTimestamp: number, newEndTimestamp: number): Promise<void> {
        const partialEvent: Partial<TimeCounterEvent> = {
            startTimestamp: newStartTimestamp,
            endTimestamp: newEndTimestamp,
        };
        return this.userTimeCounterEventsDocument$(timeCounterName)
            .pipe(
                take(1),
                switchMap(doc => doc.doc(eventId).update(partialEvent)),
            ).toPromise();
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
        // return of([
        //     generateRandomTimeCounterEvent('test', moment().subtract(10, 'hours'), 300),
        //     generateRandomTimeCounterEvent('test', moment().subtract(9, 'hours'), 6000),
        // ]);
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

    assertValidStartDate(name: string, startDate: string, fromLastEvent: boolean = true): Promise<boolean> {
        const momentDate = moment(startDate, 'DD/MM/YYYY HH:mm:ss', true);
        if (!momentDate.isValid()) {
            this.utilsService.showToast('Le format de date n\'est pas valide');
            return Promise.resolve(false);
        }
        const startTimestamp: number = momentDate.toDate().getTime();
        if (startTimestamp > moment().toDate().getTime()) {
            this.utilsService.showToast('La date et l\'heure ne peuvent pas être dans le futur');
            return Promise.resolve(false);
        }
        return this.fetchChunkTimeCounterEvents$(name, fromLastEvent ? 1 : 2).pipe(take(1)).toPromise()
            .then(chunk => {
                const previousEndTimestamp = chunk.length === (fromLastEvent ? 1 : 2) ? chunk[fromLastEvent ? 0 : 1].endTimestamp : null;
                if (previousEndTimestamp && startTimestamp <= previousEndTimestamp) {
                    this.utilsService.showToast('La date de début ne peut pas être avant la date de fin de l\'événement précédent');
                    console.warn(`startTimestamp:${startTimestamp} > previousTimestamp:${previousEndTimestamp}`);
                    return false;
                }
                return true;
            })
            .catch(err => {
                console.error('failed fetching last time counter event ::', err);
                this.utilsService.showToast('Une erreur est survenue');
                return false;
            });
    }

    assertValidEndDate(name: string, startTimestamp: number, endDate: string): boolean {
        const momentDate = moment(endDate, 'DD/MM/YYYY HH:mm:ss', true);
        if (!momentDate.isValid()) {
            this.utilsService.showToast('Le format de date n\'est pas valide');
            return false;
        }
        const endTimestamp: number = momentDate.toDate().getTime();
        if (endTimestamp > moment().toDate().getTime()) {
            this.utilsService.showToast('La date et l\'heure ne peuvent pas être dans le futur');
            return false;
        }
        if (startTimestamp && endTimestamp <= startTimestamp) {
            this.utilsService.showToast('La date/heure de fin doit être après la date/heure de début');
            return false;
        }
        return true;
    }
}
