import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { CounterComponentModule } from '../../components/counter/counter.component.module';
import { AddCounterComponentModule } from '../../components/add-counter-button/add-counter.component.module';
import { TimeCounterComponentModule } from '../../components/time-counter/time-counter.component.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      { path: '', component: HomePage },
    ]),
    CounterComponentModule,
    AddCounterComponentModule,
    TimeCounterComponentModule,
  ],
  declarations: [HomePage],
})
export class HomePageModule {}
