import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeCounterMorePopoverComponent } from './time-counter-more-popover.component';

@NgModule({
  imports: [IonicModule, CommonModule],
  exports: [TimeCounterMorePopoverComponent],
  declarations: [TimeCounterMorePopoverComponent],
  entryComponents: [TimeCounterMorePopoverComponent],
})
export class TimeCounterMorePopoverComponentModule {}
