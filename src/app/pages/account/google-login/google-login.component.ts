import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Platform } from '@ionic/angular';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { firebaseWebClientId } from '../../../../environments/firebase.config';
import { AuthService } from '../../../services/auth.service';
import { LoaderService } from '../../../services/loader.service';
import { UtilsService } from '../../../services/utils.service';

@Component({
    selector: 'app-google-login',
    templateUrl: './google-login.component.html',
    styleUrls: ['./google-login.component.scss'],
})
export class GoogleLoginComponent implements OnInit {

    constructor(
        private router: Router,
        private platform: Platform,
        private google: GooglePlus,
        private fireAuth: AngularFireAuth,
        private authService: AuthService,
        private loaderService: LoaderService,
        private utilsService: UtilsService,
    ) {
    }

    ngOnInit() {
    }

    login() {
        this.loaderService.showLoader('Connexion en cours ...');

        let loginPromise: Promise<firebase.auth.UserCredential>;
        if (this.platform.is('android') || this.platform.is('ios')) {
            loginPromise = this.mobileLogin();
        }
        loginPromise = this.fireAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
        return loginPromise
            .catch(err => {
                console.log(err);
                this.utilsService.showToast('Echec de la connexion Google')
            })
            .then(credentials => {
                this.loaderService.dismissLoader();
            });
    }

    async mobileLogin(): Promise<firebase.auth.UserCredential> {
        let params;
        if (this.platform.is('android')) {
            params = {webClientId: firebaseWebClientId, offline: true};
        } else {
            params = {};
        }
        return this.google.login(params)
            .then((response) => {
                const {idToken, accessToken} = response;
                return this.onLoginSuccess(idToken, accessToken);
            });
    }

    onLoginSuccess(accessToken, accessSecret): Promise<firebase.auth.UserCredential> {
        const credential = accessSecret ?
            firebase.auth.GoogleAuthProvider.credential(accessToken, accessSecret)
            : firebase.auth.GoogleAuthProvider.credential(accessToken);
        return this.fireAuth.auth.signInWithCredential(credential);
    }
}
