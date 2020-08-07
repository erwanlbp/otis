import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map, switchMap, take } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { TimeCounter } from '../interfaces/time-counter.interface';
import { TimeCounterEventService } from './time-counter-event.service';
import { TimeCounterEvent } from '../interfaces/time-counter-event.interface';

@Injectable({
    providedIn: 'root',
})
export class TimeCounterService {

    constructor(
        private firestore: AngularFirestore,
        private authService: AuthService,
        private timeCounterEventService: TimeCounterEventService,
    ) {
    }

    userTimeCountersDocument$(): Observable<AngularFirestoreCollection<TimeCounter>> {
        return this.authService.getUserId$().pipe(
            map(userId => {
                if (!userId) {
                    return null;
                }
                return this.firestore.collection<TimeCounter>(`users/${userId}/time-counters`);
            }),
        );
    }

    fetchTimeCounters$(): Observable<TimeCounter[]> {
        return this.userTimeCountersDocument$().pipe(
            switchMap(doc => {
                if (!doc) {
                    return of([]);
                }
                return doc.valueChanges();
            }),
        );
    }

    saveTimeCounter(counter: TimeCounter): Promise<void> {
        return this.userTimeCountersDocument$()
            .pipe(
                take(1),
                switchMap(doc => doc.doc(counter.name).set(counter)),
            )
            .toPromise();
    }

    deleteTimeCounter(counter: TimeCounter): Promise<void> {
        return this.userTimeCountersDocument$()
            .pipe(
                take(1),
                switchMap(doc => doc.doc(counter.name).delete()),
            )
            .toPromise();
    }

    checkNotAlreadyExisting(name: string): Promise<boolean> {
        return this.fetchTimeCounter$(name).pipe(take(1)).toPromise()
            .then(existing => !!existing);
    }

    fetchTimeCounter$(name: string): Observable<TimeCounter> {
        return this.userTimeCountersDocument$().pipe(switchMap(doc => doc.doc<TimeCounter>(name).valueChanges()));
    }

    startCounter(name: string): Promise<void> {
        const partialTimeCounter: Partial<TimeCounter> = { startTimestamp: new Date().getTime() };
        return this.userTimeCountersDocument$()
            .pipe(
                take(1),
                switchMap(doc => doc.doc(name).update(partialTimeCounter)),
            ).toPromise();
    }

    stopCounter(name: string): Promise<void> {
        return this.fetchTimeCounter$(name).pipe(
            take(1),
            switchMap(doc => {
                const event: TimeCounterEvent = {
                    timeCounterName: name,
                    startTimestamp: doc.startTimestamp,
                    endTimestamp: new Date().getTime(),
                };
                return this.timeCounterEventService.saveCounterEvent(event);
            }),
            switchMap(() => this.saveTimeCounter({ name })),
        ).toPromise();
    }
}
