import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Counter } from '../../interfaces/counter';
import { EventService } from '../../services/event.service';
import { LoaderService } from '../../services/loader.service';
import { PopoverController } from '@ionic/angular';
import { CounterMorePopoverComponent } from '../counter-more-popover/counter-more-popover.component';
import { EventType } from '../../interfaces/event-type.type';
import * as moment from 'moment';
import { take, takeUntil } from 'rxjs/operators';
import { UtilsService } from '../../services/utils.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss'],
})
export class CounterComponent implements OnInit, OnDestroy {
  @Input() counter: Counter;
  desktop: boolean;
  private destroyed$: Subject<void> = new Subject();

  constructor(
    private eventService: EventService,
    private loaderService: LoaderService,
    private popoverController: PopoverController,
    private utilsService: UtilsService,
    private breakpointObserver: BreakpointObserver,
  ) {}

  ngOnInit() {
    this.breakpointObserver
      .observe([Breakpoints.HandsetPortrait])
      .pipe(takeUntil(this.destroyed$))
      .subscribe(state => (this.desktop = !state.matches));
  }

  decrement() {
    this.counter.value--;
    this.counter.lastEventTs = moment().toDate().getTime();
    this.loaderService
      .showLoader('Sauvegarde ...')
      .then(() => this.saveEvent('decrement'))
      .catch(err => console.error('failed decrementing counter ::', err))
      .then(() => this.loaderService.dismissLoader());
  }

  increment() {
    this.counter.value++;
    this.counter.lastEventTs = moment().toDate().getTime();
    this.loaderService
      .showLoader('Sauvegarde ...')
      .then(() => this.saveEvent('increment'))
      .catch(err => console.error('failed incrementing counter ::', err))
      .then(() => this.loaderService.dismissLoader());
  }

  async showMoreMenu(event) {
    const popover = await this.popoverController.create({
      component: CounterMorePopoverComponent,
      event,
      componentProps: { counter: this.counter },
    });
    await popover.present();
  }

  showLastEventDate(): Promise<void> {
    return this.eventService
      .fetchChunkCounterEvents$(this.counter.name, 1)
      .pipe(take(1))
      .toPromise()
      .then(chunk => {
        if (!chunk || !chunk[0]) {
          return this.utilsService.showToast(`Aucun évenement trouvé`);
        }
        const date: string = moment(chunk[0].timestamp).format('DD/MM/YYYY HH:mm:ss');
        return this.utilsService.showToast(`Dernier évenement: ${date}`);
      });
  }

  private saveEvent(type: EventType): Promise<void> {
    return this.eventService.saveCounterEventAndSideEffects({
      timestamp: this.counter.lastEventTs,
      counterName: this.counter.name,
      type,
      newValue: this.counter.value,
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.unsubscribe();
  }
}
