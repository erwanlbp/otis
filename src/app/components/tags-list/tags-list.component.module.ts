import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TagsListComponent } from './tags-list.component';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule],
  exports: [TagsListComponent],
  declarations: [TagsListComponent],
})
export class TagsListComponentModule {}
