import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TimeCounterComponent } from './time-counter.component';
import { PipesModule } from '../../pipes/pipes.module';
import { TimeCounterMorePopoverComponentModule } from '../time-counter-more-popover/time-counter-more-popover.component.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TimeCounterMorePopoverComponentModule,
    PipesModule,
  ],
  exports: [TimeCounterComponent],
  declarations: [TimeCounterComponent],
})
export class TimeCounterComponentModule {}
