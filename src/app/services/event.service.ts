import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { CounterEvent, toCounterEvent, toCounterEventDto } from '../interfaces/counter-event.interface';
import { CounterService } from './counter.service';
import { Counter } from '../interfaces/counter';

@Injectable({
    providedIn: 'root',
})
export class EventService {
    constructor(private firestore: AngularFirestore, private authService: AuthService, private counterService: CounterService) {}

    private userCounterEventsDocument$(counterName: string): Observable<AngularFirestoreCollection<CounterEvent>> {
        return this.counterService.userCountersDocument$().pipe(map(doc => doc.doc<Counter>(counterName).collection<CounterEvent>('events')));
    }

    saveCounterEvent(event: CounterEvent, eventId?: string): Promise<void> {
        return this.userCounterEventsDocument$(event.counterName)
            .pipe(
                take(1),
                switchMap(doc => doc.doc(eventId || String(event.timestamp)).set(toCounterEventDto(event))),
                tap(() => (event.id = eventId || String(event.timestamp))),
            )
            .toPromise();
    }

    deleteCounterEvent(counterName: string, id: string): Promise<void> {
        return this.userCounterEventsDocument$(counterName)
            .pipe(
                take(1),
                switchMap(doc => doc.doc<CounterEvent>(id).delete()),
            )
            .toPromise();
    }

    fetchAllCounterEvents$(counterName: string): Observable<CounterEvent[]> {
        return this.userCounterEventsDocument$(counterName).pipe(
            switchMap(collection => collection.snapshotChanges()),
            map(events => (!events ? [] : events.map(event => toCounterEvent(event.payload.doc.id, event.payload.doc.data(), counterName)))),
        );
    }

    fetchChunkCounterEvents$(counterName: string, chunkSize: number, lastEventTs: number = null): Observable<CounterEvent[]> {
        return this.counterService.userCountersDocument$().pipe(
            map(doc =>
                doc.doc<Counter>(counterName).collection<CounterEvent>('events', ref => {
                    let newRef = ref.orderBy('timestamp', 'desc');
                    if (lastEventTs != null) {
                        newRef = newRef.startAfter(lastEventTs);
                    }
                    return newRef.limit(chunkSize);
                }),
            ),
            switchMap(collection => collection.snapshotChanges()),
            map(events => (!events ? [] : events.map(event => toCounterEvent(event.payload.doc.id, event.payload.doc.data(), counterName)))),
        );
    }
}
