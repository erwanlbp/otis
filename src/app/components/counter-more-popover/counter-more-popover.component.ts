import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, NavParams, PopoverController } from '@ionic/angular';
import { UtilsService } from '../../services/utils.service';
import { CounterService } from '../../services/counter.service';
import { Counter } from '../../interfaces/counter';
import { CounterIncrementComponent } from '../counter-increment/counter-increment.component';
import { FirstEventComponent } from '../first-event/first-event.component';
import { TagsEditComponent } from '../tags-edit/tags-edit.component';

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
  ) {}

  ngOnInit() {
    this.counter = this.navParams.get('counter');
  }

  async close() {
    return this.popoverController.dismiss();
  }

  async delete(counter: Counter) {
    this.close();
    const confirmed = await this.utilsService.askForConfirmation();
    if (!confirmed) {
      return;
    }
    await this.counterService.deleteCounter(counter);
  }

  events(counter: Counter) {
    this.navController.navigateForward(`/counter-events/${counter.name}`).then(() => this.close());
  }

  chart(counter: Counter) {
    this.navController.navigateForward(`/counter-chart/${counter.name}`).then(() => this.close());
  }

  async addMoreThanOne() {
    this.close();
    const modal = await this.modalController.create({ component: CounterIncrementComponent, componentProps: { counter: this.counter } });
    await modal.present();
  }

  async switchAtomicActionsActive(counter: Counter) {
    this.close();
    const confirmed = await this.utilsService.askForConfirmation(
      `Ceci ${counter.areAtomicButtonsActive ? 'désactivera' : 'activera'} les boutons +/- de ce compteur sur la liste des compteurs`,
      null,
    );
    if (!confirmed) {
      return;
    }
    const tempCounter: Counter = {
      ...counter,
      areAtomicButtonsActive: !counter.areAtomicButtonsActive,
    };
    this.counterService.saveCounter(tempCounter).catch(err => {
      console.error('failed switching counter areAtomicButtonsActive ::', err);
      this.utilsService.showToast('Echec de la sauvegarde');
    });
  }

  async details() {
    this.close();
    const modal = await this.popoverController.create({ component: FirstEventComponent, componentProps: { counter: this.counter } });
    await modal.present();
  }

  async tagCounter() {
    this.close();
    const modal = await this.modalController.create({ component: TagsEditComponent, componentProps: { counter: this.counter } });
    await modal.present();
  }
}
