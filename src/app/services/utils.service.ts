import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class UtilsService {

    constructor(
        private alertController: AlertController,
    ) {
    }

    async askForConfirmation(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.alertController.create({
                header: 'Etes vous sur ?',
                buttons: [
                    {
                        text: 'Annuler',
                        role: 'cancel',
                        cssClass: 'secondary',
                        handler: () => resolve(false)
                    },
                    {
                        text: 'Confirmer',
                        handler: () => resolve(true)
                    }
                ]
            }).then(alert => alert.present());
        });
    }
}
