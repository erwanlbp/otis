import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map, switchMap, take } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Tag, TagFirebaseDto } from '../interfaces/tag';

@Injectable({
  providedIn: 'root',
})
export class TagService {
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

  fetchTags$(): Observable<Tag[]> {
    return this.userTagsDocument$().pipe(
      switchMap(doc => {
        if (!doc) {
          return of([] as TagFirebaseDto[]);
        }
        return doc.valueChanges();
      }),
      map(tags => tags.map(tag => Tag.from(tag))),
    );
  }

  saveTag(tag: Tag): Promise<void> {
    return this.userTagsDocument$()
      .pipe(take(1))
      .toPromise()
      .then(tags => tags.doc<TagFirebaseDto>(tag.name).set(tag.toFirebaseDto()));
  }
}
