import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, NavParams, PopoverController } from '@ionic/angular';
import { UtilsService } from '../../services/utils.service';
import { EventService } from '../../services/event.service';
import { TimeCounter } from '../../interfaces/time-counter.interface';
import { TimeCounterService } from '../../services/time-counter.service';

@Component({
    selector: 'app-time-counter-more-popover',
    templateUrl: './time-counter-more-popover.component.html',
    styleUrls: ['./time-counter-more-popover.component.scss'],
})
export class TimeCounterMorePopoverComponent implements OnInit {

    private timeCounter: TimeCounter;

    constructor(
        private navParams: NavParams,
        private popoverController: PopoverController,
        private navController: NavController,
        private utilsService: UtilsService,
        private timeCounterService: TimeCounterService,
        private alertController: AlertController,
        private eventService: EventService,
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
}
