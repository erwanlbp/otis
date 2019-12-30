import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { LoadingController, Platform } from '@ionic/angular';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { firebaseWebClientId } from '../../../../environments/firebase.config';

@Component({
    selector: 'app-google-login',
    templateUrl: './google-login.component.html',
    styleUrls: ['./google-login.component.scss'],
})
export class GoogleLoginComponent implements OnInit {

    loading: any;

    constructor(
        private router: Router,
        private platform: Platform,
        private google: GooglePlus,
        public loadingController: LoadingController,
        private fireAuth: AngularFireAuth
    ) {
    }

    async ngOnInit() {
        this.loading = await this.loadingController.create({
            message: 'Connecting ...'
        });
    }

    async presentLoading(loading) {
        await loading.present();
    }

    async login() {
        let params;
        if (this.platform.is('android')) {
            params = {webClientId: firebaseWebClientId, offline: true};
        } else {
            params = {};
        }
        this.google.login(params)
            .then((response) => {
                console.log('resp:', response);
                const {idToken, accessToken} = response;
                this.onLoginSuccess(idToken, accessToken);
            })
            .catch((error) => {
                console.log('error:', error);
            });
    }

    onLoginSuccess(accessToken, accessSecret) {
        const credential = accessSecret ?
            firebase.auth.GoogleAuthProvider.credential(accessToken, accessSecret)
            : firebase.auth.GoogleAuthProvider.credential(accessToken);
        this.fireAuth.auth.signInWithCredential(credential)
            .then((response) => {
                this.router.navigate(['/tabs/home']);
                this.loading.dismiss();
            });
    }
}
