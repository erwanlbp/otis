import { Component, Input, OnInit } from '@angular/core';
import { Counter } from '../../interfaces/counter';
import { CounterService } from '../../services/counter.service';
import { UtilsService } from '../../services/utils.service';
import { EventService } from '../../services/event.service';
import { LoaderService } from "../../services/loader.service";

@Component({
    selector: 'app-counter',
    templateUrl: './counter.component.html',
    styleUrls: ['./counter.component.scss'],
})
export class CounterComponent implements OnInit {

    @Input() counter: Counter;

    constructor(
        private counterService: CounterService,
        private eventService: EventService,
        private utilsService: UtilsService,
        private loaderService: LoaderService,
    ) {
    }

    ngOnInit() {
    }

    decrement() {
        this.counter.value--;
        this.counterService.saveCounter(this.counter)
            .then(() => this.saveEvent('decrement'))
            .catch(err => console.log(err))
            .then(() => this.loaderService.dismissLoader());
    }

    increment() {
        this.loaderService.showLoader();
        this.counter.value++;
        this.counterService.saveCounter(this.counter)
            .then(() => this.saveEvent('increment'))
            .catch(err => console.log(err))
            .then(() => this.loaderService.dismissLoader());
    }

    private saveEvent(type: string): Promise<void> {
        return this.eventService.saveCounterEvent({
            timestamp: new Date().getTime(),
            counterName: this.counter.name,
            type,
            newValue: this.counter.value,
        });
    }

    async delete() {
        this.utilsService.askForConfirmation()
            .then(confirmed => {
                if (!confirmed) {
                    return;
                }
                this.counterService.deleteCounter(this.counter);
            });
    }
}
