import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddTagButtonComponent } from './add-tag-button.component';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule],
  exports: [AddTagButtonComponent],
  declarations: [AddTagButtonComponent],
})
export class AddTagButtonComponentModule {}
