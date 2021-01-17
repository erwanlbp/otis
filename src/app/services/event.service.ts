import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { CounterEvent, toCounterEvent, toCounterEventDto } from '../interfaces/counter-event.interface';
import { CounterService } from './counter.service';
import { Counter } from '../interfaces/counter';
import * as moment from 'moment';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  constructor(private firestore: AngularFirestore, private counterService: CounterService, private utilsService: UtilsService) {}

  /**
   * @param eventId is used only for updating, it's the primary key of the event
   */
  saveCounterEventAndSideEffects(event: CounterEvent, eventId?: string): Promise<void> {
    return this.saveCounterEvent(event, eventId).then(() =>
      this.counterService.updateLastEventTsAndValue(event.counterName, event.timestamp, event.newValue),
    );
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

  assertValidEventDate(counterName: string, date: string, fromPreviousLastEvent: boolean = false): Promise<boolean> {
    const momentDate = moment(date, 'DD/MM/YYYY HH:mm:ss', true);
    if (!momentDate.isValid()) {
      this.utilsService.showToast("Le format de date n'est pas valide");
      return Promise.resolve(false);
    }
    const newTimestamp: number = momentDate.toDate().getTime();
    if (newTimestamp > moment().toDate().getTime()) {
      this.utilsService.showToast("La date et l'heure ne peuvent pas être dans le futur");
      return Promise.resolve(false);
    }
    return this.fetchChunkCounterEvents$(counterName, fromPreviousLastEvent ? 2 : 1)
      .pipe(take(1))
      .toPromise()
      .then(chunk => {
        let previousTimestamp;
        if (fromPreviousLastEvent) {
          previousTimestamp = chunk.length === 2 ? chunk[1].timestamp : null;
        } else {
          previousTimestamp = chunk.length === 1 ? chunk[0].timestamp : null;
        }
        if (previousTimestamp && newTimestamp <= previousTimestamp) {
          this.utilsService.showToast("L'événement doit rester le dernier de la liste");
          return false;
        }
        return true;
      })
      .catch(err => {
        console.error('failed fetching last event ::', err);
        this.utilsService.showToast('Une erreur est survenue');
        return false;
      });
  }

  fetchFirstEvent$(name: string): Observable<CounterEvent> {
    return this.counterService.userCountersDocument$().pipe(
      switchMap(doc =>
        doc
          .doc<Counter>(name)
          .collection<CounterEvent>('events', ref => ref.orderBy('timestamp', 'asc').limit(1))
          .snapshotChanges(),
      ),
      map(events => (events.length ? events[0] : null)),
      map(event => toCounterEvent(event.payload.doc.id, event.payload.doc.data(), name)),
    );
  }

  private userCounterEventsDocument$(counterName: string): Observable<AngularFirestoreCollection<CounterEvent>> {
    return this.counterService.userCountersDocument$().pipe(map(doc => doc.doc<Counter>(counterName).collection<CounterEvent>('events')));
  }

  private saveCounterEvent(event: CounterEvent, eventId?: string): Promise<void> {
    return this.userCounterEventsDocument$(event.counterName)
      .pipe(
        take(1),
        switchMap(doc => doc.doc(eventId || String(event.timestamp)).set(toCounterEventDto(event))),
        tap(() => (event.id = eventId || String(event.timestamp))),
      )
      .toPromise();
  }
}
