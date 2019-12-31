import { Component, OnInit } from '@angular/core';
import { CounterService } from '../../services/counter.service';
import { Counter } from '../../interfaces/counter';
import { AlertController } from '@ionic/angular';
import { UtilsService } from "../../services/utils.service";
import { take } from "rxjs/operators";

@Component({
    selector: 'app-add-counter',
    templateUrl: './add-counter.component.html',
    styleUrls: ['./add-counter.component.scss'],
})
export class AddCounterComponent implements OnInit {

    constructor(
        private counterService: CounterService,
        private alertController: AlertController,
        private utilsService: UtilsService,
    ) {
    }

    ngOnInit() {
    }


    createCounter() {
        this.askForNameAndValue()
            .then((counter: Counter) => {
                if (!counter) {
                    return;
                }
                return this.counterService.getCounter$(counter.name).pipe(take(1)).toPromise()
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
                        handler: (data) => resolve({name: data.name, value: Number(data.value)})
                    }
                ]
            }).then(alert => alert.present());
        });
    }
}