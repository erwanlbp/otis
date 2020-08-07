import { Component, Input, OnInit } from '@angular/core';
import { LoaderService } from '../../services/loader.service';
import { PopoverController } from '@ionic/angular';
import { TimeCounter } from '../../interfaces/time-counter.interface';
import { UtilsService } from '../../services/utils.service';
import { TimeCounterMorePopoverComponent } from '../time-counter-more-popover/time-counter-more-popover.component';

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

    startStop() {
        this.utilsService.showToast('Lancement du compteur ' + this.timeCounter.name);
    }
}
