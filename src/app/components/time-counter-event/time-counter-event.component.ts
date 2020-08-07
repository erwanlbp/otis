import { Component, Input, OnInit } from '@angular/core';
import { UtilsService } from '../../services/utils.service';
import * as moment from 'moment';
import { TimeCounterEvent } from '../../interfaces/time-counter-event.interface';
import { TimeCounterEventService } from '../../services/time-counter-event.service';

interface TimeCounterEventWithDate extends TimeCounterEvent {
    duration: moment.Duration;
}

@Component({
    selector: 'app-time-counter-event',
    templateUrl: './time-counter-event.component.html',
    styleUrls: ['./time-counter-event.component.scss'],
})
export class TimeCounterEventComponent implements OnInit {

    event: TimeCounterEventWithDate;
    editMode = false;

    @Input('event') set timeCounterEvent(ev: TimeCounterEvent) {
        this.event = {
            ...ev,
            duration: ev.startTimestamp && ev.endTimestamp ? moment.duration(ev.endTimestamp - ev.startTimestamp, 'milliseconds') : null,
        };
    }

    constructor(
        private timeCounterEventService: TimeCounterEventService,
        private utilsService: UtilsService,
    ) {
    }

    ngOnInit() {
    }

    delete() {
        this.utilsService.askForConfirmation()
            .then(confirmed => {
                if (!confirmed) {
                    return;
                }
                return this.timeCounterEventService.deleteTimeCounterEvent(this.event.timeCounterName, this.event.id);
            });
    }
}
