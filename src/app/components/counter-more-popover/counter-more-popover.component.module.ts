import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CounterMorePopoverComponent } from './counter-more-popover.component';
import { CounterIncrementComponentModule } from '../counter-increment/counter-increment.component.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    CounterIncrementComponentModule,
  ],
  exports: [CounterMorePopoverComponent],
  declarations: [CounterMorePopoverComponent],
  entryComponents: [CounterMorePopoverComponent],
})
export class CounterMorePopoverComponentModule {}
