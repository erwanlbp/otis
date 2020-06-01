import { Component, Input, OnInit } from '@angular/core';
import { UtilsService } from '../../services/utils.service';
import { CounterEvent } from '../../interfaces/counter-event.interface';
import { EventService } from '../../services/event.service';
import * as moment from 'moment';
import { LoaderService } from '../../services/loader.service';
import { CounterService } from '../../services/counter.service';

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

    constructor(private eventService: EventService, private utilsService: UtilsService, private loaderService: LoaderService, private counterService: CounterService) {}

    ngOnInit() {}

    delete() {
        this.utilsService.askForConfirmation().then(confirmed => {
            if (!confirmed) {
                return;
            }
            this.eventService.deleteCounterEvent(this.event.counterName, this.event.id);
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
            this.utilsService.showToast("Le format de date n'est pas valide");
            return;
        }
        const newTimestamp: number = momentDate.toDate().getTime();
        if (this.previousTimestamp && newTimestamp <= this.previousTimestamp) {
            this.utilsService.showToast("L'événement doit rester le dernier de la liste");
            return;
        }
        if (newTimestamp > new Date().getTime()) {
            this.utilsService.showToast("La date et l'heure ne peuvent pas être dans le futur");
            return;
        }
        this.event.timestamp = newTimestamp;
        this.editMode = false;
        this.loaderService
            .showLoader()
            .then(() => this.eventService.saveCounterEvent(this.event, this.event.id))
            .then(() => this.counterService.updateLastEventTs(this.event.counterName, this.event.timestamp))
            .catch(err => {
                console.error(err);
                this.utilsService.showToast('Echec de la sauvegarde');
            })
            .then(() => this.loaderService.dismissLoader());
    }

    timestampsAreEquals(newDateTime: string) {
        return moment(newDateTime, 'DD/MM/YYYY HH:mm:ss').toDate().getTime() === this.event.timestamp;
    }
}
