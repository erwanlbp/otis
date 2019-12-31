import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(
        private fireauth: AngularFireAuth,
    ) {
    }

    getUserId$(): Observable<string> {
        return this.fireauth.authState.pipe(map(user => user ? user.uid : null));
    }

    getUserEmail$() {
        return this.fireauth.user.pipe(map(user => user ? user.email : null));
    }

    logout() {
        this.fireauth.auth.signOut();
    }
}
