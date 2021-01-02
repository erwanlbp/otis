import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddCounterComponent } from './add-counter.component';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule],
  exports: [AddCounterComponent],
  declarations: [AddCounterComponent],
})
export class AddCounterComponentModule {}
