import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CounterChartPage } from './counter-chart.page';
import { RouterModule } from '@angular/router';
import { CounterChartComponentModule } from '../../components/counter-chart/counter-chart.component.module';
import { CounterBarChartComponentModule } from 'src/app/components/counter-bar-chart/counter-bar-chart.component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      { path: ':counterName', component: CounterChartPage },
    ]),
    CounterChartComponentModule,
    CounterBarChartComponentModule,
  ],
  providers: [DatePipe],
  declarations: [CounterChartPage],
})
export class CounterChartPageModule {}
