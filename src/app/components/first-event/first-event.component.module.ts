import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirstEventComponent } from './first-event.component';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule],
  exports: [FirstEventComponent],
  declarations: [FirstEventComponent],
  entryComponents: [FirstEventComponent],
})
export class FirstEventComponentModule {}
