import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CounterMorePopoverComponent } from './counter-more-popover.component';
import { CounterIncrementComponentModule } from '../counter-increment/counter-increment.component.module';
import { FirstEventComponentModule } from '../first-event/first-event.component.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    CounterIncrementComponentModule,
    FirstEventComponentModule,
  ],
  exports: [CounterMorePopoverComponent],
  declarations: [CounterMorePopoverComponent],
  entryComponents: [CounterMorePopoverComponent],
})
export class CounterMorePopoverComponentModule {}
