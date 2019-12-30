import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
    selector: 'app-tab2',
    templateUrl: 'account.page.html',
    styleUrls: ['account.page.scss']
})
export class AccountPage implements OnInit {

    constructor(
        private firebaseAuth: AngularFireAuth,
    ) {
    }

    ngOnInit(): void {
    }

    logout() {
        this.firebaseAuth.auth.signOut()
            .catch(err => {
                console.log(err);
            });
    }
}
