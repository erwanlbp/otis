import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TagsListComponent } from './tags-list.component';
import { AddTagButtonComponentModule } from '../add-tag-button/add-tag-button.component.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    AddTagButtonComponentModule,
  ],
  exports: [TagsListComponent],
  declarations: [TagsListComponent],
})
export class TagsListComponentModule {}
