import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeCounterEventEditPopoverComponent } from './time-counter-event-edit-popover.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        ReactiveFormsModule,
    ],
    exports: [TimeCounterEventEditPopoverComponent],
    declarations: [TimeCounterEventEditPopoverComponent],
    entryComponents: [TimeCounterEventEditPopoverComponent],
})
export class TimeCounterEventEditPopoverComponentModule {
}
