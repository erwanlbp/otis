import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TagsEditComponent } from './tags-edit.component';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule],
  exports: [TagsEditComponent],
  declarations: [TagsEditComponent],
  entryComponents: [TagsEditComponent],
})
export class TagsEditComponentModule {}
