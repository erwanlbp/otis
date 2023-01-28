import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { UtilsService } from '../../services/utils.service';
import { Counter } from '../../interfaces/counter';
import * as moment from 'moment';
import { EventService } from '../../services/event.service';
import { EventType, getEventType } from '../../interfaces/event-type.type';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../services/loader.service';
import { Observable, Subject } from 'rxjs';
import { filter, startWith, takeUntil } from 'rxjs/operators';
import { CounterService } from 'src/app/services/counter.service';

@Component({
  selector: 'app-counter-increment',
  templateUrl: './counter-increment.component.html',
  styleUrls: ['./counter-increment.component.scss'],
})
export class CounterIncrementComponent implements OnInit {
  counter$: Observable<Counter>;
  form: FormGroup;
  private destroyed$: Subject<void> = new Subject();

  constructor(
    private navParams: NavParams,
    private modalController: ModalController,
    private utilsService: UtilsService,
    private eventService: EventService,
    private formBuilder: FormBuilder,
    private loaderService: LoaderService,
    private counterService: CounterService,
  ) {}

  ngOnInit() {
    const counter = this.navParams.get('counter');
    this.counter$ = this.counterService.fetchCounter$(counter.name).pipe(startWith(counter));

    this.form = this.formBuilder.group({
      date: this.formBuilder.control(moment().format('DD/MM/YYYY HH:mm:ss'), [Validators.required]),
      counterNewValue: this.formBuilder.control(1, [Validators.required]),
      incrementValue: this.formBuilder.control(1, [Validators.required]),
      addAnotherValue: this.formBuilder.control(false),
    });

    this.counter$.pipe(takeUntil(this.destroyed$)).subscribe(counter => {
      this.form.get('counterNewValue').patchValue(counter.value + this.form.get('incrementValue').value);
    });
  }

  updateIncrementValueControl(counter: Counter) {
    const newValue: number = this.form.get('counterNewValue').value;
    this.form.get('incrementValue').setValue(newValue - counter.value);
  }

  updateNewValueControl(counter: Counter) {
    const incrementValue: number = this.form.get('incrementValue').value;
    this.form.get('counterNewValue').setValue(counter.value + incrementValue);
  }

  removeTime(seconds: number) {
    let date = moment(this.form.get('date').value, 'DD/MM/YYYY HH:mm:ss', true).subtract(seconds, 'second');
    this.form.get('date').patchValue(date.format('DD/MM/YYYY HH:mm:ss'));
  }

  resetTime() {
    this.form.get('date').patchValue(moment().format('DD/MM/YYYY HH:mm:ss'));
  }

  close() {
    this.modalController.dismiss();
  }

  submit(counter: Counter) {
    const value: number = this.form.get('incrementValue').value;
    if (!value || value === 0) {
      this.utilsService.showToast("Incrémenter de 0 n'est pas autorisé");
      return;
    }
    const eventType: EventType = getEventType(value);
    const eventDate: string = this.form.get('date').value;
    return this.loaderService
      .showLoader('Validation de la date ...')
      .then(() => this.eventService.assertValidEventDate(counter.name, eventDate))
      .then(async valid => {
        if (!valid) {
          console.error('event date is not valid, nothing to do');
          return;
        }
        await this.loaderService.showLoader('Sauvegarde ...');
        return this.eventService
          .saveCounterEventAndSideEffects({
            counterName: counter.name,
            timestamp: moment(eventDate, 'DD/MM/YYYY HH:mm:ss', true).toDate().getTime(),
            type: eventType,
            value,
            newValue: counter.value + value,
          })
          .then(() => this.finishedSubmitting());
      })
      .catch(err => {
        console.error('failed incrementing/decrementing counter ::', err);
        this.utilsService.showToast('Echec lors de la sauvegarde');
      })
      .then(() => this.loaderService.dismissLoader());
  }

  private finishedSubmitting(): void {
    const addAnotherValue: boolean = this.form.get('addAnotherValue').value;
    if (addAnotherValue) {
      // this.updateNewValueControl();
      this.form.get('date').setValue(moment().format('DD/MM/YYYY HH:mm:ss'));
    } else {
      this.close();
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.unsubscribe();
  }
}
