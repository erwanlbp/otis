import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-tab2',
    templateUrl: 'account.page.html',
    styleUrls: ['account.page.scss']
})
export class AccountPage implements OnInit {

    email: Observable<string>;
    isLoggedIn: Observable<boolean>;

    constructor(
        private authService: AuthService,
    ) {
    }

    ngOnInit(): void {
        this.email = this.authService.getUserEmail$();
        this.isLoggedIn = this.authService.getUserId$().pipe(map(userId => !!userId));
    }

    logout() {
        this.authService.logout();
    }
}
