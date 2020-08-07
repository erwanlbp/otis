import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { UtilsService } from '../../../services/utils.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { TimeCounter } from '../../../interfaces/time-counter.interface';
import { TimeCounterService } from '../../../services/time-counter.service';

@Component({
    selector: 'app-add-time-counter',
    templateUrl: '../add-button.component.html',
    styleUrls: ['../add-button.component.scss'],
})
export class AddTimeCounterComponent implements OnInit, OnDestroy {

    private destroyed$: Subject<void> = new Subject();
    connected: boolean;

    constructor(
        private timeCounterService: TimeCounterService,
        private alertController: AlertController,
        private utilsService: UtilsService,
        private authService: AuthService,
    ) {
    }

    ngOnInit() {
        this.authService
            .isConnected$()
            .pipe(takeUntil(this.destroyed$))
            .subscribe(isConnected => (this.connected = isConnected));
    }

    createCounter() {
        if (!this.connected) {
            this.utilsService.showToast('Connectez vous pour créer un compteur');
            return;
        }
        this.askForName().then(timeCounter => {
            if (!timeCounter) {
                return;
            }
            return this.timeCounterService.checkNotAlreadyExisting(timeCounter.name)
                .then(alreadyExisting => {
                    if (alreadyExisting) {
                        this.utilsService.showToast('Ce compteur existe déjà');
                        return;
                    }
                    return this.timeCounterService.saveTimeCounter(timeCounter);
                })
                .catch(err => {
                    this.utilsService.showToast('Une erreur est survenue');
                    console.error('failed creating time counter ::', err);
                });
        });
    }

    private askForName(): Promise<TimeCounter> {
        return new Promise((resolve, reject) => {
            this.alertController
                .create({
                    header: 'Nouveau compteur de temps',
                    message: 'Remplissez le nom',
                    inputs: [
                        {
                            placeholder: 'Nom',
                            type: 'text',
                            name: 'name',
                        },
                    ],
                    buttons: [
                        {
                            text: 'Annuler',
                            role: 'cancel',
                            cssClass: 'secondary',
                            handler: () => resolve(null),
                        },
                        {
                            text: 'Confirmer',
                            handler: data => resolve({ name: data.name }),
                        },
                    ],
                })
                .then(alert => alert.present());
        });
    }

    ngOnDestroy() {
        this.destroyed$.next();
        this.destroyed$.unsubscribe();
    }
}
