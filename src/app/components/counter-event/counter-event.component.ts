import { Component, Input, OnInit } from '@angular/core';
import { UtilsService } from '../../services/utils.service';
import { CounterEvent } from '../../interfaces/counter-event.interface';
import { EventService } from '../../services/event.service';
import * as moment from 'moment';
import { LoaderService } from '../../services/loader.service';

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

    constructor(
        private eventService: EventService,
        private utilsService: UtilsService,
        private loaderService: LoaderService,
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
                this.eventService.deleteCounterEvent(this.event.counterName, this.event.timestamp);
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

    modifyEvent(value: string) {
        const momentDate = moment(value, 'DD/MM/YYYY HH:mm:ss', true);
        if (!momentDate.isValid()) {
            this.utilsService.showToast('Le format de date n\'est pas valide');
            return;
        }
        const newTimestamp: number = momentDate.toDate().getTime();
        if (this.previousTimestamp && newTimestamp <= this.previousTimestamp) {
            this.utilsService.showToast('L\'événement doit rester le dernier de la liste');
            return;
        }
        if (newTimestamp > new Date().getTime()) {
            this.utilsService.showToast('La date et l\'heure ne peuvent pas être dans le futur');
            return;
        }
        const oldTimestamp: number = this.event.timestamp;
        this.event.timestamp = newTimestamp;
        this.editMode = false;
        this.loaderService.showLoader()
            .then(() => this.eventService.saveCounterEvent(this.event))
            .then(() => {
                return this.eventService.deleteCounterEvent(this.event.counterName, oldTimestamp);
            })
            .then(() => this.loaderService.dismissLoader())
            .catch(err => {
                console.log(err);
                this.loaderService.dismissLoader();
                this.utilsService.showToast('Echec de la sauvegarde');
            });
    }

    timestampsAreEquals(newDateTime: string) {
        return moment(newDateTime, 'DD/MM/YYYY HH:mm:ss').toDate().getTime() === this.event.timestamp;
    }
}
