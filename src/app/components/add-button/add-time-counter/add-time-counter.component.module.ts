import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddTimeCounterComponent } from './add-time-counter.component';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
    ],
    exports: [
        AddTimeCounterComponent
    ],
    declarations: [AddTimeCounterComponent]
})
export class AddTimeCounterComponentModule {
}
