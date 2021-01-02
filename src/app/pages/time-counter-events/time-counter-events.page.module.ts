import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TimeCounterEventsPage } from './time-counter-events.page';
import { TimeCounterEventComponentModule } from '../../components/time-counter-event/time-counter-event.component.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: ':timeCounterName',
        component: TimeCounterEventsPage,
      },
    ]),
    TimeCounterEventComponentModule,
  ],
  declarations: [TimeCounterEventsPage],
})
export class TimeCounterEventsPageModule {}
