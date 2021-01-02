import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CounterBarChartComponent } from './counter-bar-chart.component';

@NgModule({
  imports: [IonicModule, CommonModule],
  exports: [CounterBarChartComponent],
  declarations: [CounterBarChartComponent],
})
export class CounterBarChartComponentModule {}
