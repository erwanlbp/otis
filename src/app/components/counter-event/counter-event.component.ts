import { Component, Input, OnInit } from '@angular/core';
import { UtilsService } from '../../services/utils.service';
import { CounterEvent } from '../../interfaces/counter-event.interface';
import { EventService } from '../../services/event.service';
import * as moment from 'moment';
import { LoaderService } from '../../services/loader.service';
import { CounterService } from '../../services/counter.service';
import { getEventTypeIcon } from '../../interfaces/event-type.type';

interface CounterEventWithDate extends CounterEvent {
    date: Date;
}

@Component({
    selector: 'app-counter-event',
    templateUrl: './counter-event.component.html',
    styleUrls: ['./counter-event.component.scss'],
})
export class CounterEventComponent implements OnInit {
    event: CounterEventWithDate;
    editMode = false;

    @Input('event') set counterEvent(ev: CounterEvent) {
        this.event = {
            ...ev,
            date: ev.timestamp ? new Date(ev.timestamp) : null,
        };
    }

    @Input() isLast = false;
    @Input() previousTimestamp: number;

    constructor(private eventService: EventService, private utilsService: UtilsService, private loaderService: LoaderService, private counterService: CounterService) {
    }

    ngOnInit() {
    }

    delete() {
        this.utilsService.askForConfirmation().then(confirmed => {
            if (!confirmed) {
                return;
            }
            this.eventService.deleteCounterEvent(this.event.counterName, this.event.id);
        });
    }

    getIcon(): string {
        return getEventTypeIcon(this.event.type);
    }

    modifyEvent(value: string) {
        return this.loaderService.showLoader('Validation de la date ...')
            .then(() => this.eventService.assertValidEventDate(this.event.counterName, value))
            .then(async isValid => {
                if (!isValid) {
                    console.error('event date is not valid, nothing to do');
                    return;
                }
                await this.loaderService.showLoader('Sauvegarde ...');
                this.event.timestamp = moment(value, 'DD/MM/YYYY HH:mm:ss', true).toDate().getTime();
                this.editMode = false;
                return this.eventService.saveCounterEventAndSideEffects(this.event, this.event.id);
            })
            .catch(err => {
                console.error('failed editing event ::', err);
                this.utilsService.showToast('Echec de la sauvegarde');
            })
            .then(() => this.loaderService.dismissLoader());
    }

    timestampsAreEquals(newDateTime: string) {
        return moment(newDateTime, 'DD/MM/YYYY HH:mm:ss').toDate().getTime() === this.event.timestamp;
    }
}
