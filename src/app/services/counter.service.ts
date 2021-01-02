import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Counter, CounterFirebaseDto, toCounter, toCounterDto } from '../interfaces/counter';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map, switchMap, take } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class CounterService {
  constructor(private firestore: AngularFirestore, private authService: AuthService) {}

  userCountersDocument$(): Observable<AngularFirestoreCollection<CounterFirebaseDto>> {
    return this.authService.getUserId$().pipe(
      map(userId => {
        if (!userId) {
          return null;
        }
        return this.firestore.collection<CounterFirebaseDto>(`users/${userId}/counters`);
      }),
    );
  }

  fetchCounters$(): Observable<Counter[]> {
    return this.userCountersDocument$().pipe(
      switchMap(doc => {
        if (!doc) {
          return of([] as CounterFirebaseDto[]);
        }
        return doc.valueChanges();
      }),
      map(counters => counters.map(counter => toCounter(counter))),
    );
  }

  saveCounter(counter: Counter): Promise<void> {
    return this.userCountersDocument$()
      .pipe(
        take(1),
        switchMap(doc => doc.doc(counter.name).set(toCounterDto(counter))),
      )
      .toPromise();
  }

  updateLastEventTsAndValue(counterName: string, timestamp: number, value: number) {
    const partialCounter: Partial<CounterFirebaseDto> = {
      lastEventTs: timestamp,
      value,
    };
    return this.userCountersDocument$()
      .pipe(
        take(1),
        switchMap(doc => doc.doc(counterName).update(partialCounter)),
      )
      .toPromise();
  }

  deleteCounter(counter: Counter): Promise<void> {
    return this.userCountersDocument$()
      .pipe(
        take(1),
        switchMap(doc => doc.doc(counter.name).delete()),
      )
      .toPromise();
  }

  fetchCounter$(name: string): Observable<Counter> {
    return this.userCountersDocument$().pipe(
      switchMap(doc => doc.doc<CounterFirebaseDto>(name).valueChanges()),
      map(counter => toCounter(counter)),
    );
  }
}
