import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UtilsService } from '../../services/utils.service';
import * as moment from 'moment';
import { TimeCounterEvent } from '../../interfaces/time-counter-event.interface';
import { TimeCounterEventService } from '../../services/time-counter-event.service';
import { PopoverController } from '@ionic/angular';
import { TimeCounterEventEditPopoverComponent } from '../time-counter-event-edit-popover/time-counter-event-edit-popover.component';
import { TimeCounterService } from '../../services/time-counter.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

interface TimeCounterEventWithDate extends TimeCounterEvent {
  duration: moment.Duration;
}

@Component({
  selector: 'app-time-counter-event',
  templateUrl: './time-counter-event.component.html',
  styleUrls: ['./time-counter-event.component.scss'],
})
export class TimeCounterEventComponent implements OnInit, OnDestroy {
  event: TimeCounterEventWithDate;
  @Input() isLast: boolean = false;
  desktop: boolean = true;
  private destroyed$: Subject<void> = new Subject();

  @Input('event') set timeCounterEvent(ev: TimeCounterEvent) {
    this.event = {
      ...ev,
      duration: ev.startTimestamp && ev.endTimestamp ? moment.duration(ev.endTimestamp - ev.startTimestamp, 'milliseconds') : null,
    };
  }

  constructor(
    private timeCounterEventService: TimeCounterEventService,
    private utilsService: UtilsService,
    private popoverController: PopoverController,
    private timeCounterService: TimeCounterService,
    private breakpointObserver: BreakpointObserver,
  ) {}

  ngOnInit() {
    this.breakpointObserver
      .observe([Breakpoints.HandsetPortrait])
      .pipe(takeUntil(this.destroyed$))
      .subscribe(state => (this.desktop = !state.matches));
  }

  delete() {
    this.utilsService.askForConfirmation().then(confirmed => {
      if (!confirmed) {
        return;
      }
      return this.timeCounterEventService.deleteTimeCounterEvent(this.event.timeCounterName, this.event.id);
    });
  }

  async edit(event) {
    if (!this.isLast) {
      this.utilsService.showToast('Seul le dernier event est modifiable');
      return;
    }
    if (await this.timeCounterService.isStarted(this.event.timeCounterName)) {
      this.utilsService.showToast("L'édition n'est pas possible quand un événement de comptage est en cours");
      return;
    }
    const popover = await this.popoverController.create({
      component: TimeCounterEventEditPopoverComponent,
      componentProps: { timeCounterEvent: this.event },
    });
    await popover.present();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.unsubscribe();
  }
}
