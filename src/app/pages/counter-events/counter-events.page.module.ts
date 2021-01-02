import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CounterEventsPage } from './counter-events.page';
import { CounterEventComponentModule } from '../../components/counter-event/counter-event.component.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: ':counterName',
        component: CounterEventsPage,
      },
    ]),
    CounterEventComponentModule,
  ],
  declarations: [CounterEventsPage],
})
export class CounterEventsPageModule {}
