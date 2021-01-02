import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CounterChartComponent } from './counter-chart.component';

@NgModule({
  imports: [IonicModule, CommonModule],
  exports: [CounterChartComponent],
  declarations: [CounterChartComponent],
})
export class CounterChartComponentModule {}
