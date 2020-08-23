import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';
import { UtilsService } from '../../services/utils.service';
import { TimeCounterService } from '../../services/time-counter.service';
import { TimeCounterEventService } from '../../services/time-counter-event.service';
import { TimeCounterEvent } from '../../interfaces/time-counter-event.interface';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../services/loader.service';

@Component({
    selector: 'app-time-counter-event-edit-popover',
    templateUrl: './time-counter-event-edit-popover.component.html',
    styleUrls: ['./time-counter-event-edit-popover.component.scss'],
})
export class TimeCounterEventEditPopoverComponent implements OnInit {

    event: TimeCounterEvent;
    form: FormGroup;

    constructor(
        private navParams: NavParams,
        private popoverController: PopoverController,
        private utilsService: UtilsService,
        private timeCounterService: TimeCounterService,
        private timeCounterEventService: TimeCounterEventService,
        private loaderService: LoaderService,
    ) {
    }

    ngOnInit() {
        this.event = this.navParams.get('timeCounterEvent');
        this.form = new FormGroup({
            startDate: new FormControl(UtilsService.formatToDateTime(this.event.startTimestamp), [Validators.required]),
            endDate: new FormControl(UtilsService.formatToDateTime(this.event.endTimestamp), [Validators.required]),
        });
    }

    close() {
        this.popoverController.dismiss();
    }

    async modifyEvent() {
        await this.loaderService.showLoader('Vérifications ...');
        const newStartDate: string = this.form.get('startDate').value;
        const newEndDate: string = this.form.get('endDate').value;
        let validNewStartDate = true;
        if (this.differentStartDate()) {
            validNewStartDate = await this.timeCounterEventService.assertValidStartDate(this.event.timeCounterName, newStartDate, false);
        }
        let validNewEndDate = true;
        if (this.differentEndDate()) {
            validNewEndDate = this.timeCounterEventService.assertValidEndDate(this.event.timeCounterName, this.event.startTimestamp, newEndDate);
        }
        if (!validNewStartDate || !validNewEndDate) {
            await this.loaderService.dismissLoader();
            return;
        }
        await this.loaderService.showLoader('Sauvegarde ...');
        await this.timeCounterEventService.updateEventTimestamps(this.event.timeCounterName, this.event.id, UtilsService.parseDateTimeToTimestamp(newStartDate), UtilsService.parseDateTimeToTimestamp(newEndDate));
        await this.loaderService.dismissLoader();
        this.close();
    }

    cancelStartDate() {
        this.form.get('startDate').setValue(UtilsService.formatToDateTime(this.event.startTimestamp));
    }

    cancelEndDate() {
        this.form.get('endDate').setValue(UtilsService.formatToDateTime(this.event.endTimestamp));
    }

    datesAreTheSameAsBefore() {
        return !this.differentStartDate() && !this.differentEndDate();
    }

    differentStartDate(): boolean {
        return UtilsService.formatToDateTime(this.event.startTimestamp) !== this.form.get('startDate').value;
    }

    differentEndDate(): boolean {
        return UtilsService.formatToDateTime(this.event.endTimestamp) !== this.form.get('endDate').value;
    }
}
