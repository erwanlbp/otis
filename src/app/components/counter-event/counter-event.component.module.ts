import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CounterEventComponent } from './counter-event.component';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
    ],
    exports: [
        CounterEventComponent
    ],
    declarations: [CounterEventComponent]
})
export class CounterEventComponentModule {
}
