import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { AuthService } from "../../services/auth.service";

@Component({
    selector: 'app-tab2',
    templateUrl: 'account.page.html',
    styleUrls: ['account.page.scss']
})
export class AccountPage implements OnInit {

    email: Observable<string>;

    constructor(
        private fireauth: AngularFireAuth,
        private authService:AuthService,
    ) {
    }

    ngOnInit(): void {
        this.email = this.authService.getUserEmail$();
    }

    logout() {
        this.fireauth.auth.signOut()
            .catch(err => {
                console.log(err);
            });
    }
}
