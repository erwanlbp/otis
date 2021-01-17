import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlphabeticalCountersListComponent } from './alphabetical-counters-list.component';
import { CounterComponentModule } from '../../components/counter/counter.component.module';
import { AddCounterComponentModule } from '../../components/add-counter-button/add-counter.component.module';
import { TimeCounterComponentModule } from '../../components/time-counter/time-counter.component.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: AlphabeticalCountersListComponent,
      },
    ]),
    CounterComponentModule,
    AddCounterComponentModule,
    TimeCounterComponentModule,
  ],
  declarations: [AlphabeticalCountersListComponent],
})
export class AlphabeticalCountersListModule {}
