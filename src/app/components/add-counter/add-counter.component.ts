import { Component, OnInit, OnDestroy } from '@angular/core';
import { CounterService } from '../../services/counter.service';
import { Counter } from '../../interfaces/counter';
import { AlertController } from '@ionic/angular';
import { UtilsService } from '../../services/utils.service';
import { take, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { auth } from 'firebase';

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
        private authService: AuthService,
    ) {
    }

    ngOnInit() {
        this.authService.isConnected$().pipe(takeUntil(this.destroyed$)).subscribe(isConnected => this.connected = isConnected);
    }


    createCounter() {
        if (!this.connected) {
            this.utilsService.showToast('Connectez vous pour créer un compteur');
            return;
        }
        this.askForNameAndValue()
            .then((counter: Counter) => {
                if (!counter) {
                    return;
                }
                return this.counterService.fetchCounter$(counter.name).pipe(take(1)).toPromise()
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
            this.alertController.create({
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
                    }
                ],
                buttons: [
                    {
                        text: 'Annuler',
                        role: 'cancel',
                        cssClass: 'secondary',
                        handler: () => resolve(null)
                    },
                    {
                        text: 'Confirmer',
                        handler: (data) => resolve({ name: data.name, value: Number(data.value) })
                    }
                ]
            }).then(alert => alert.present());
        });
    }

    ngOnDestroy() {
        this.destroyed$.next();
        this.destroyed$.unsubscribe();
    }
}
