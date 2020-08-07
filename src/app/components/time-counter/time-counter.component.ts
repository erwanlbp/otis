import { Component, Input, OnInit } from '@angular/core';
import { LoaderService } from '../../services/loader.service';
import { PopoverController } from '@ionic/angular';
import { TimeCounter } from '../../interfaces/time-counter.interface';
import { UtilsService } from '../../services/utils.service';
import { TimeCounterMorePopoverComponent } from '../time-counter-more-popover/time-counter-more-popover.component';
import { TimeCounterService } from '../../services/time-counter.service';

@Component({
    selector: 'app-time-counter',
    templateUrl: './time-counter.component.html',
    styleUrls: ['./time-counter.component.scss'],
})
export class TimeCounterComponent implements OnInit {

    @Input() timeCounter: TimeCounter;

    constructor(
        private loaderService: LoaderService,
        private popoverController: PopoverController,
        private timeCounterService: TimeCounterService,
        private utilsService: UtilsService,
    ) {
    }

    ngOnInit() {
    }

    async showMoreMenu(event) {
        const popover = await this.popoverController.create({
            component: TimeCounterMorePopoverComponent,
            event,
            componentProps: { timeCounter: this.timeCounter },
        });
        await popover.present();
    }

    start() {
        this.loaderService.showLoader('Lancement ...')
            .then(() => this.timeCounterService.startCounter(this.timeCounter.name))
            .catch(err => {
                console.error('failed starting time counter ::', err);
                this.utilsService.showToast('Une erreur est survenue');
            })
            .then(() => this.loaderService.dismissLoader());
    }

    stop() {
        this.loaderService.showLoader('Arrêt ...')
            .then(() => this.timeCounterService.stopCounter(this.timeCounter.name))
            .catch(err => {
                console.error('failed stoping time counter ::', err);
                this.utilsService.showToast('Une erreur est survenue');
            })
            .then(() => this.loaderService.dismissLoader());
    }
}
