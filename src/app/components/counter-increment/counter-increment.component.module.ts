import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CounterIncrementComponent } from './counter-increment.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        ReactiveFormsModule,
    ],
    exports: [CounterIncrementComponent],
    declarations: [CounterIncrementComponent],
    entryComponents: [CounterIncrementComponent],
})
export class CounterIncrementComponentModule {
}
