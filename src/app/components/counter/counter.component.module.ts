import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CounterComponent } from './counter.component';
import { CounterMorePopoverComponentModule } from '../counter-more-popover/counter-more-popover.component.module';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        CounterMorePopoverComponentModule,
    ],
    exports: [
        CounterComponent
    ],
    declarations: [CounterComponent],
})
export class CounterComponentModule {
}
