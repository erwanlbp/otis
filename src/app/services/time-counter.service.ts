import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map, switchMap, take } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { TimeCounter } from '../interfaces/time-counter.interface';

@Injectable({
    providedIn: 'root',
})
export class TimeCounterService {

    constructor(
        private firestore: AngularFirestore,
        private authService: AuthService,
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
}
