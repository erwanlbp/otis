import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CounterMorePopoverComponent } from './counter-more-popover.component';
import { CounterIncrementComponentModule } from '../counter-increment/counter-increment.component.module';
import { FirstEventComponentModule } from '../first-event/first-event.component.module';
import { TagsEditComponentModule } from '../tags-edit/tags-edit.component.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    CounterIncrementComponentModule,
    FirstEventComponentModule,
    TagsEditComponentModule,
  ],
  exports: [CounterMorePopoverComponent],
  declarations: [CounterMorePopoverComponent],
  entryComponents: [CounterMorePopoverComponent],
})
export class CounterMorePopoverComponentModule {}
