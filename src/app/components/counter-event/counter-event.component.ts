import { Component, Input, OnInit } from '@angular/core';
import { UtilsService } from '../../services/utils.service';
import { CounterEvent } from '../../interfaces/counter-event.interface';
import { EventService } from '../../services/event.service';

@Component({
    selector: 'app-counter-event',
    templateUrl: './counter-event.component.html',
    styleUrls: ['./counter-event.component.scss'],
})
export class CounterEventComponent implements OnInit {

    @Input() event: CounterEvent;

    constructor(
        private eventService: EventService,
        private utilsService: UtilsService,
    ) {
    }

    ngOnInit() {
    }

    async delete() {
        this.utilsService.askForConfirmation()
            .then(confirmed => {
                if (!confirmed) {
                    return;
                }
                this.eventService.deleteCounterEvent(this.event);
            });
    }

    getIcon(): string {
        switch (this.event.type) {
            case 'increment':
                return 'add';
            case 'decrement':
                return 'remove';
            default:
                return 'help';
        }
    }
}
