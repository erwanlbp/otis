import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { UtilsService } from '../../services/utils.service';
import { Counter } from '../../interfaces/counter';
import * as moment from 'moment';
import { EventService } from '../../services/event.service';
import { EventType, getEventType } from '../../interfaces/event-type.type';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-counter-increment',
  templateUrl: './counter-increment.component.html',
  styleUrls: ['./counter-increment.component.scss'],
})
export class CounterIncrementComponent implements OnInit {
  counter: Counter;
  form: FormGroup;

  constructor(
    private navParams: NavParams,
    private modalController: ModalController,
    private utilsService: UtilsService,
    private eventService: EventService,
    private formBuilder: FormBuilder,
    private loaderService: LoaderService,
  ) {}

  ngOnInit() {
    this.counter = this.navParams.get('counter');

    const counterNewValueControl = this.formBuilder.control(this.counter.value + 1, [Validators.required]);
    const incrementValueControl = this.formBuilder.control(1, [Validators.required]);
    this.form = this.formBuilder.group({
      date: this.formBuilder.control(moment().format('DD/MM/YYYY HH:mm:ss'), [Validators.required]),
      counterNewValue: counterNewValueControl,
      incrementValue: incrementValueControl,
      addAnotherValue: this.formBuilder.control(false),
    });
  }

  updateIncrementValueControl() {
    const newValue: number = this.form.get('counterNewValue').value;
    this.form.get('incrementValue').setValue(newValue - this.counter.value);
  }

  updateNewValueControl() {
    const incrementValue: number = this.form.get('incrementValue').value;
    this.form.get('counterNewValue').setValue(this.counter.value + incrementValue);
  }

  close() {
    this.modalController.dismiss();
  }

  submit() {
    const value: number = this.form.get('incrementValue').value;
    if (!value || value === 0) {
      this.utilsService.showToast("Incrémenter de 0 n'est pas autorisé");
      return;
    }
    const eventType: EventType = getEventType(value);
    const eventDate: string = this.form.get('date').value;
    return this.loaderService
      .showLoader('Validation de la date ...')
      .then(() => this.eventService.assertValidEventDate(this.counter.name, eventDate))
      .then(async valid => {
        if (!valid) {
          console.error('event date is not valid, nothing to do');
          return;
        }
        await this.loaderService.showLoader('Sauvegarde ...');
        return this.eventService
          .saveCounterEventAndSideEffects({
            counterName: this.counter.name,
            timestamp: moment(eventDate, 'DD/MM/YYYY HH:mm:ss', true).toDate().getTime(),
            type: eventType,
            value,
            newValue: (this.counter.value += value),
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
      this.updateNewValueControl();
      this.form.get('date').setValue(moment().format('DD/MM/YYYY HH:mm:ss'));
    } else {
      this.close();
    }
  }
}
