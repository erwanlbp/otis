import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection, DocumentChangeAction, QueryFn } from '@angular/fire/firestore';
import { map, switchMap, take } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Tag, TagFirebaseDto } from '../interfaces/tag';
import { CounterTag, CounterTagFirebaseDto } from '../interfaces/counter-tag';
import { Counter } from '../interfaces/counter';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  private allTags$: Observable<Tag[]>;
  private allCounterTags$: Observable<CounterTag[]>;

  constructor(private firestore: AngularFirestore, private authService: AuthService) {}

  userTagsDocument$(): Observable<AngularFirestoreCollection<TagFirebaseDto>> {
    return this.authService.getUserId$().pipe(
      map(userId => {
        if (!userId) {
          return null;
        }
        return this.firestore.collection<TagFirebaseDto>(`users/${userId}/tags`);
      }),
    );
  }

  userCounterTagsDocument$(query?: QueryFn): Observable<AngularFirestoreCollection<CounterTagFirebaseDto>> {
    return this.authService.getUserId$().pipe(
      map(userId => {
        if (!userId) {
          return null;
        }
        return this.firestore.collection<CounterTagFirebaseDto>(`users/${userId}/counters-tags`, query);
      }),
    );
  }

  fetchTags$(): Observable<Tag[]> {
    if (!this.allTags$) {
      this.allTags$ = this.userTagsDocument$().pipe(
        switchMap(doc => {
          if (!doc) {
            return of([] as TagFirebaseDto[]);
          }
          return doc.valueChanges();
        }),
        map(tags => tags.map(tag => Tag.from(tag))),
      );
    }
    return this.allTags$;
  }

  saveTag(tag: Tag): Promise<void> {
    return this.userTagsDocument$()
      .pipe(take(1))
      .toPromise()
      .then(tags => tags.doc<TagFirebaseDto>(tag.name).set(tag.toFirebaseDto()));
  }

  fetchCountersTags$(): Observable<CounterTag[]> {
    if (!this.allCounterTags$) {
      this.allCounterTags$ = this.userCounterTagsDocument$().pipe(
        switchMap(doc => {
          if (!doc) {
            return of([] as CounterTagFirebaseDto[]);
          }
          return doc.valueChanges();
        }),
        map(countersTags => countersTags.map(counterTag => CounterTag.from(counterTag))),
      );
    }
    return this.allCounterTags$;
  }

  fetchCounterTags$(counter: Counter): Observable<CounterTag[]> {
    return this.fetchCountersTags$().pipe(map(countersTags => countersTags.filter(counterTag => counterTag.counter === counter.name)));
  }

  addTagToCounter(tag: Tag, counter: Counter): Promise<void> {
    const counterTag = new CounterTag(counter.name, tag.name);
    return this.userCounterTagsDocument$()
      .pipe(take(1))
      .toPromise()
      .then(userTags => {
        userTags.add(counterTag.toFirebaseDto());
      });
  }

  removeTagFromCounter(tag: Tag, counter: Counter): Promise<void> {
    return this.userCounterTagsDocument$(ref => ref.where('counter', '==', counter.name).where('tag', '==', tag.name))
      .pipe(
        switchMap(collection => collection.snapshotChanges()),
        map((counterTags: DocumentChangeAction<CounterTagFirebaseDto>[]) =>
          !counterTags ? [] : counterTags.map(counterTag => counterTag.payload.doc.id),
        ),
        take(1),
      )
      .toPromise()
      .then(idsToDelete =>
        this.userCounterTagsDocument$()
          .pipe(take(1))
          .toPromise()
          .then(collection => Promise.all(idsToDelete.map(idToDelete => collection.doc(idToDelete).delete()))),
      )
      .then(() => null);
  }

  deleteTag(tag: Tag): Promise<void> {
    return this.userTagsDocument$()
      .pipe(take(1))
      .toPromise()
      .then(collection => collection.doc<TagFirebaseDto>(tag.name).delete());
  }
}
