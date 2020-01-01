import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map, switchMap, take } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { CounterEvent, toCounterEvent, toCounterEventDto } from '../interfaces/counter-event.interface';
import { CounterService } from './counter.service';
import { Counter } from '../interfaces/counter';

@Injectable({
    providedIn: 'root'
})
export class EventService {

    constructor(
        private firestore: AngularFirestore,
        private authService: AuthService,
        private counterService: CounterService,
    ) {
    }

    private userCounterEventsDocument$(counterName: string): Observable<AngularFirestoreCollection<CounterEvent>> {
        return this.counterService.userCountersDocument$().pipe(
            map(doc => doc.doc<Counter>(counterName).collection<CounterEvent>('events'))
        );
    }

    saveCounterEvent(event: CounterEvent): Promise<void> {
        return this.userCounterEventsDocument$(event.counterName).pipe(
            take(1),
            switchMap(doc => doc.doc(String(event.timestamp)).set(toCounterEventDto(event)))
        ).toPromise();
    }

    deleteCounterEvent(event: CounterEvent): Promise<void> {
        return this.userCounterEventsDocument$(event.counterName).pipe(
            take(1),
            switchMap(doc => doc.doc<CounterEvent>(String(event.timestamp)).delete())
        ).toPromise();
    }

    fetchCounterEvents$(counterName: string): Observable<CounterEvent[]> {
        return this.userCounterEventsDocument$(counterName).pipe(
            switchMap(doc => doc.valueChanges()),
            map(events => !events ? [] : events.map(event => toCounterEvent(event, counterName)))
        );
    }
}
