import { Component, Input, OnInit } from '@angular/core';
import { Counter } from '../../interfaces/counter';
import { EventService } from '../../services/event.service';
import { LoaderService } from '../../services/loader.service';
import { PopoverController } from '@ionic/angular';
import { CounterMorePopoverComponent } from '../counter-more-popover/counter-more-popover.component';
import { EventType } from '../../interfaces/event-type.type';
import * as moment from 'moment';

@Component({
    selector: 'app-counter',
    templateUrl: './counter.component.html',
    styleUrls: ['./counter.component.scss'],
})
export class CounterComponent implements OnInit {

    @Input() counter: Counter;

    constructor(
        private eventService: EventService,
        private loaderService: LoaderService,
        private popoverController: PopoverController,
    ) {
    }

    ngOnInit() {
    }

    decrement() {
        this.counter.value--;
        this.counter.lastEventTs = moment().toDate().getTime();
        this.loaderService.showLoader('Sauvegarde ...')
            .then(() => this.saveEvent('decrement'))
            .catch(err => console.error('failed decrementing counter ::', err))
            .then(() => this.loaderService.dismissLoader());
    }

    increment() {
        this.counter.value++;
        this.counter.lastEventTs = moment().toDate().getTime();
        this.loaderService.showLoader('Sauvegarde ...')
            .then(() => this.saveEvent('increment'))
            .catch(err => console.error('failed incrementing counter ::', err))
            .then(() => this.loaderService.dismissLoader());
    }

    private saveEvent(type: EventType): Promise<void> {
        return this.eventService.saveCounterEventAndSideEffects({
            timestamp: this.counter.lastEventTs,
            counterName: this.counter.name,
            type,
            newValue: this.counter.value,
        });
    }

    async showMoreMenu(event) {
        const popover = await this.popoverController.create({
            component: CounterMorePopoverComponent,
            event,
            componentProps: { counter: this.counter },
        });
        await popover.present();
    }
}
