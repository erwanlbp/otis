import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor(private alertController: AlertController, private toastController: ToastController) {}

  static formatToDateTime(timestamp: number): string {
    return moment(timestamp).format('DD/MM/YYYY HH:mm:ss');
  }

  static parseDateTimeToTimestamp(dateTime: string): number {
    return moment(dateTime, 'DD/MM/YYYY HH:mm:ss').toDate().getTime();
  }

  async askForConfirmation(message?: string, header: string = 'Êtes vous sûr ?'): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.alertController
        .create({
          header,
          message,
          buttons: [
            {
              text: 'Annuler',
              role: 'cancel',
              cssClass: 'secondary',
              handler: () => resolve(false),
            },
            {
              text: 'Confirmer',
              handler: () => resolve(true),
            },
          ],
        })
        .then(alert => alert.present());
    });
  }

  async showToast(msg: string) {
    const toast = await this.toastController.create({ message: msg, duration: 4000 });
    await toast.present();
  }
}
