import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { LoaderService } from '../../../services/loader.service';
import { UtilsService } from '../../../services/utils.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-google-login',
  templateUrl: './google-login.component.html',
  styleUrls: ['./google-login.component.scss'],
})
export class GoogleLoginComponent implements OnInit {
  constructor(
    private navController: NavController,
    private loaderService: LoaderService,
    private utilsService: UtilsService,
    private authService: AuthService,
  ) {}

  ngOnInit() {}

  login() {
    this.loaderService.showLoader('Connexion en cours ...');
    this.authService
      .login()
      .catch(err => {
        console.error(err);
        this.utilsService.showToast('Echec de la connexion Google');
      })
      .then(credentials => {
        this.loaderService.dismissLoader();
        this.navController.navigateRoot('/');
      });
  }
}
