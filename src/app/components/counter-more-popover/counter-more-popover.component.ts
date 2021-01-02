import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, NavParams, PopoverController } from '@ionic/angular';
import { UtilsService } from '../../services/utils.service';
import { CounterService } from '../../services/counter.service';
import { Counter } from '../../interfaces/counter';
import * as moment from 'moment';
import { EventService } from '../../services/event.service';
import { EventType, getEventType } from '../../interfaces/event-type.type';

@Component({
    selector: 'app-counter-more-popover',
    templateUrl: './counter-more-popover.component.html',
    styleUrls: ['./counter-more-popover.component.scss'],
})
export class CounterMorePopoverComponent implements OnInit {
    counter: Counter;

    constructor(
        private navParams: NavParams,
        private popoverController: PopoverController,
        private navController: NavController,
        private utilsService: UtilsService,
        private counterService: CounterService,
        private alertController: AlertController,
        private eventService: EventService,
    ) {
    }

    ngOnInit() {
        this.counter = this.navParams.get('counter');
    }

    close() {
        this.popoverController.dismiss();
    }

    async delete() {
        this.close();
        const confirmed = await this.utilsService.askForConfirmation();
        if (!confirmed) {
            return;
        }
        await this.counterService.deleteCounter(this.counter);
    }

    events() {
        this.navController.navigateForward(`/counter-events/${this.counter.name}`)
            .then(() => this.close());
    }

    chart() {
        this.navController.navigateForward(`/counter-chart/${this.counter.name}`)
            .then(() => this.close());
    }

    async addMoreThanOne() {
        this.close();
        const alert = await this.alertController.create({
            header: 'Quelle date et valeur d\'incrémentation ?',
            message: 'Entrer la date et la valeur d\'incrémentation (entrer un nombre négatif pour décrementer)',
            inputs: [
                {
                    label: 'Date',
                    type: 'text',
                    value: moment().format('DD/MM/YYYY HH:mm:ss'),
                    name: 'eventDate',
                    placeholder: 'Date (DD/MM/YYYY HH:mm:ss)',
                },
                {
                    label: 'Pas',
                    type: 'number',
                    value: 1,
                    name: 'value',
                    placeholder: 'Pas d\'incrémentation',
                },
            ],
            buttons: [
                {
                    text: 'Annuler',
                    role: 'cancel',
                    cssClass: 'secondary',
                },
                {
                    text: 'Confirmer',
                    role: 'confirm',
                },
            ],
        });
        alert
            .onDidDismiss()
            .then(data => {
                if (data.role !== 'confirm') {
                    return;
                }
                const value: number = data.data.values.value ? Number(data.data.values.value) : null;
                if (!value || value === 0) {
                    this.utilsService.showToast('0 n\'est pas autorisé');
                    return;
                }
                const eventType: EventType = getEventType(value);
                const eventDate: string = data.data.values.eventDate;
                return this.eventService.assertValidEventDate(this.counter.name, eventDate)
                    .then(valid => {
                        if (!valid) {
                            console.error('event date is not valid, nothing to do');
                            return;
                        }
                        return this.eventService.saveCounterEventAndSideEffects({
                            counterName: this.counter.name,
                            timestamp: moment(eventDate, 'DD/MM/YYYY HH:mm:ss', true).toDate().getTime(),
                            type: eventType,
                            value,
                            newValue: this.counter.value + value,
                        });
                    })
                    .catch(err => {
                        console.error('failed incrementing/decrementing counter ::', err);
                        this.utilsService.showToast('Echec lors de la sauvegarde');
                    });
            });

        await alert.present();
    }

    async switchAtomicActionsActive() {
        this.close();
        const confirmed = await this.utilsService.askForConfirmation(`Ceci ${this.counter.areAtomicButtonsActive ? 'désactivera' : 'activera'} les boutons +/- de ce compteur sur la liste des compteurs`, null);
        if (!confirmed) {
            return;
        }
        const tempCounter: Counter = {
            ...this.counter,
            areAtomicButtonsActive: !this.counter.areAtomicButtonsActive,
        };
        this.counterService.saveCounter(tempCounter)
            .then(() => {
                this.counter.areAtomicButtonsActive = tempCounter.areAtomicButtonsActive;
            })
            .catch(err => {
                console.error('failed switching counter areAtomicButtonsActive ::', err);
                this.utilsService.showToast('Echec de la sauvegarde');
            });
    }
}
