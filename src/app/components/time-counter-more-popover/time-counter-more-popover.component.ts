import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, NavParams, PopoverController } from '@ionic/angular';
import { UtilsService } from '../../services/utils.service';
import { TimeCounter } from '../../interfaces/time-counter.interface';
import { TimeCounterService } from '../../services/time-counter.service';
import * as moment from 'moment';
import { TimeCounterEventService } from '../../services/time-counter-event.service';

@Component({
    selector: 'app-time-counter-more-popover',
    templateUrl: './time-counter-more-popover.component.html',
    styleUrls: ['./time-counter-more-popover.component.scss'],
})
export class TimeCounterMorePopoverComponent implements OnInit {

    timeCounter: TimeCounter;

    constructor(
        private navParams: NavParams,
        private popoverController: PopoverController,
        private navController: NavController,
        private utilsService: UtilsService,
        private timeCounterService: TimeCounterService,
        private alertController: AlertController,
        private timeCounterEventService: TimeCounterEventService,
    ) {
    }

    ngOnInit() {
        this.timeCounter = this.navParams.get('timeCounter');
    }

    close() {
        this.popoverController.dismiss();
    }

    delete() {
        this.utilsService.askForConfirmation()
            .then(confirmed => {
                if (!confirmed) {
                    return;
                }
                this.timeCounterService.deleteTimeCounter(this.timeCounter);
            })
            .then(() => this.close());
    }

    events() {
        this.navController.navigateForward(`/time-counter-events/${this.timeCounter.name}`)
            .then(() => this.close());
    }

    async startInPast() {
        if (this.timeCounter.startTimestamp) {
            this.utilsService.showToast('Un compteur est déjà démarré');
            return;
        }
        const alert = await this.alertController.create({
            header: 'Quelle est la date et/ou l\'heure de début',
            inputs: [{
                type: 'text',
                value: moment().format('DD/MM/YYYY HH:mm:ss'),
                name: 'startDate',
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
                const startDate: string = data.data.values.startDate;
                return this.timeCounterEventService.assertValidStartDate(this.timeCounter.name, startDate)
                    .then(valid => {
                        if (!valid) {
                            console.error('start date is not valid, nothing to do');
                            return;
                        }
                        return this.timeCounterService.startCounter(this.timeCounter.name, moment(startDate, 'DD/MM/YYYY HH:mm:ss', true).toDate().getTime());
                    })
                    .catch(err => {
                        console.error('failed starting counter in past ::', err);
                        this.utilsService.showToast('Echec lors de la sauvegarde');
                    });
            });
        await alert.present();
        this.close();
    }

    async stopInPast() {
        if (!this.timeCounter.startTimestamp) {
            this.utilsService.showToast('Le compteur n\'est pas démarré');
            return;
        }
        const alert = await this.alertController.create({
            header: 'Quelle est la date et/ou l\'heure de fin',
            inputs: [{
                type: 'text',
                value: moment().format('DD/MM/YYYY HH:mm:ss'),
                name: 'startDate',
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
                const endDate: string = data.data.values.startDate;
                const valid = this.timeCounterEventService.assertValidEndDate(this.timeCounter.name, this.timeCounter.startTimestamp, endDate);
                if (!valid) {
                    console.error('start date is not valid, nothing to do');
                    return;
                }
                return this.timeCounterService.stopCounter(this.timeCounter.name, moment(endDate, 'DD/MM/YYYY HH:mm:ss', true).toDate().getTime())
                    .catch(err => {
                        console.error('failed stoping counter in past ::', err);
                        this.utilsService.showToast('Echec lors de la sauvegarde');
                    });
            });
        await alert.present();
        this.close();
    }
}
