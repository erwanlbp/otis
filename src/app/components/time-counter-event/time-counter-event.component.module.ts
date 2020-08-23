import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TimeCounterEventComponent } from './time-counter-event.component';
import { PipesModule } from '../../pipes/pipes.module';
import { TimeCounterEventEditPopoverComponentModule } from '../time-counter-event-edit-popover/time-counter-event-edit-popover.component.module';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        PipesModule,
        TimeCounterEventEditPopoverComponentModule,
    ],
    exports: [
        TimeCounterEventComponent,
    ],
    declarations: [TimeCounterEventComponent],
})
export class TimeCounterEventComponentModule {
}
