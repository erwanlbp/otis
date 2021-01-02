import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, NavController, NavParams, PopoverController } from '@ionic/angular';
import { UtilsService } from '../../services/utils.service';
import { CounterService } from '../../services/counter.service';
import { Counter } from '../../interfaces/counter';
import { EventService } from '../../services/event.service';
import { CounterIncrementComponent } from '../counter-increment/counter-increment.component';

@Component({
  selector: 'app-counter-more-popover',
  templateUrl: './counter-more-popover.component.html',
  styleUrls: ['./counter-more-popover.component.scss'],
})
export class CounterMorePopoverComponent implements OnInit {
  counter: Counter;

  constructor(
    private navParams: NavParams,
    private popoverController: PopoverController,
    private modalController: ModalController,
    private navController: NavController,
    private utilsService: UtilsService,
    private counterService: CounterService,
    private alertController: AlertController,
    private eventService: EventService,
  ) {}

  ngOnInit() {
    this.counter = this.navParams.get('counter');
  }

  async close() {
    return this.popoverController.dismiss();
  }

  async delete() {
    this.close();
    const confirmed = await this.utilsService.askForConfirmation();
    if (!confirmed) {
      return;
    }
    await this.counterService.deleteCounter(this.counter);
  }

  events() {
    this.navController.navigateForward(`/counter-events/${this.counter.name}`).then(() => this.close());
  }

  chart() {
    this.navController.navigateForward(`/counter-chart/${this.counter.name}`).then(() => this.close());
  }

  async addMoreThanOne() {
    this.close();
    const modal = await this.modalController.create({ component: CounterIncrementComponent, componentProps: { counter: this.counter } });
    await modal.present();
  }

  async switchAtomicActionsActive() {
    this.close();
    const confirmed = await this.utilsService.askForConfirmation(
      `Ceci ${this.counter.areAtomicButtonsActive ? 'désactivera' : 'activera'} les boutons +/- de ce compteur sur la liste des compteurs`,
      null,
    );
    if (!confirmed) {
      return;
    }
    const tempCounter: Counter = {
      ...this.counter,
      areAtomicButtonsActive: !this.counter.areAtomicButtonsActive,
    };
    this.counterService
      .saveCounter(tempCounter)
      .then(() => {
        this.counter.areAtomicButtonsActive = tempCounter.areAtomicButtonsActive;
      })
      .catch(err => {
        console.error('failed switching counter areAtomicButtonsActive ::', err);
        this.utilsService.showToast('Echec de la sauvegarde');
      });
  }
}
