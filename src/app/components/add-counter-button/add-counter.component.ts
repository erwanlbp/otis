import { Component, OnDestroy, OnInit } from '@angular/core';
import { CounterService } from '../../services/counter.service';
import { Counter } from '../../interfaces/counter';
import { AlertController } from '@ionic/angular';
import { UtilsService } from '../../services/utils.service';
import { take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { TimeCounter } from '../../interfaces/time-counter.interface';
import { TimeCounterService } from '../../services/time-counter.service';

@Component({
    selector: 'app-add-counter',
    templateUrl: './add-counter.component.html',
    styleUrls: ['./add-counter.component.scss'],
})
export class AddCounterComponent implements OnInit, OnDestroy {

    private destroyed$: Subject<void> = new Subject();
    connected: boolean;

    constructor(
        private counterService: CounterService,
        private alertController: AlertController,
        private utilsService: UtilsService,
        private timeCounterService: TimeCounterService,
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
        this.askForNameAndValue().then(counter => {
            if (!counter) {
                return;
            }
            return this.counterService
                .fetchCounter$(counter.name)
                .pipe(take(1))
                .toPromise()
                .then(existingCounter => {
                    if (existingCounter) {
                        this.utilsService.showToast('Ce compteur existe déjà avec la valeur ' + existingCounter.value);
                        return;
                    }
                    return this.counterService.saveCounter(counter);
                });
        });
    }

    private askForNameAndValue(): Promise<Counter> {
        return new Promise((resolve, reject) => {
            this.alertController
                .create({
                    header: 'Nouveau compteur',
                    message: 'Remplissez le nom et la valeur de départ',
                    inputs: [
                        {
                            placeholder: 'Nom',
                            type: 'text',
                            name: 'name',
                        },
                        {
                            placeholder: 'Valeur de départ',
                            type: 'number',
                            name: 'value',
                            value: 0,
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
                            handler: data => resolve({ name: data.name, value: Number(data.value), lastEventTs: null, areAtomicButtonsActive: true }),
                        },
                    ],
                })
                .then(alert => alert.present());
        });
    }

    createTimeCounter() {
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

    async addCounter() {
        if (!this.connected) {
            this.utilsService.showToast('Connectez vous pour créer un compteur');
            return;
        }
        const alert = await this.alertController.create({
            subHeader: 'Quel type de compteur ajouter ?',
            buttons: [
                {
                    text: 'Unitaire',
                    role: 'unit',
                    handler: () => this.createCounter(),
                }, {
                    text: 'Temporel',
                    role: 'time',
                    handler: () => this.createTimeCounter(),
                },
            ],
        });
        await alert.present();
    }
}
