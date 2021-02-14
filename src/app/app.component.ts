import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { RouteConstants } from './constants/route.constants';
import { AuthService } from './services/auth.service';
import { Observable } from 'rxjs';
import * as jsonPackage from './../../package.json';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  connected$: Observable<boolean>;
  version: string = jsonPackage.version;

  pages = [
    {
      title: 'Compteurs',
      url: RouteConstants.HOME,
      icon: 'home',
    },
    {
      title: 'Tags',
      url: RouteConstants.TAG,
      icon: 'pricetag',
    },
    {
      title: 'Compte',
      url: RouteConstants.ACCOUNT,
      icon: 'contact',
    },
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthService,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    moment.locale('fr-FR');
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnInit() {
    this.connected$ = this.authService.isConnected$();
  }

  logout() {
    this.authService.logout();
  }

  login() {
    this.authService.login();
  }
}
