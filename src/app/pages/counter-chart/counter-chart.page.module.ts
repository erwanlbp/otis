import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CounterChartPage } from './counter-chart.page';
import { RouterModule } from '@angular/router';
import { CounterChartComponent } from '../../components/counter-chart/counter-chart.component';
import { CounterChartComponentModule } from '../../components/counter-chart/counter-chart.component.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild([
            {path: ':counterName', component: CounterChartComponent},
        ]),
        CounterChartComponentModule,
    ],
    declarations: [CounterChartPage]
})
export class CounterChartPageModule {
}
