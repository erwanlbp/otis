import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Counter } from '../interfaces/counter';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { switchMap, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class CounterService {

    constructor(
        private firestore: AngularFirestore,
        private fireauth: AngularFireAuth,
    ) {
    }

    fetchCounters(): Observable<Counter[]> {
        return this.fireauth.authState.pipe(
            switchMap(user => {
                if (!user) {
                    return of([]);
                }
                console.log(user);
                return this.firestore.collection<Counter[]>(`users/${user.uid}/counters`).valueChanges();
            }),
            tap(x => console.log(x)),
        );
    }
}
