import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, NavParams, PopoverController } from '@ionic/angular';
import { UtilsService } from '../../services/utils.service';
import { CounterService } from '../../services/counter.service';
import { Counter } from '../../interfaces/counter';
import * as moment from 'moment';
import { EventService } from '../../services/event.service';

@Component({
    selector: 'app-counter-more-popover',
    templateUrl: './counter-more-popover.component.html',
    styleUrls: ['./counter-more-popover.component.scss'],
})
export class CounterMorePopoverComponent implements OnInit {

    private counter: Counter;

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

    async addInPast() {
        this.close();
        const alert = await this.alertController.create({
            header: 'Quelle est la date et/ou l\'heure de l\'événement',
            inputs: [{
                type: 'text',
                value: moment().format('DD/MM/YYYY HH:mm:ss'),
                name: 'eventDate',
            }],
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
        alert.onDidDismiss()
            .then(data => {
                if (data.role !== 'confirm') {
                    return;
                }
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
                            type: 'increment',
                            newValue: this.counter.value + 1,
                        });
                    })
                    .catch(err => {
                        console.error('failed incrementing counter in past ::', err);
                        this.utilsService.showToast('Echec lors de la sauvegarde');
                    });
            });
        await alert.present();
    }
}
