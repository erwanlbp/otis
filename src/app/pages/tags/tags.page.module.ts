import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagsPage } from './tags.page';
import { AddTagButtonComponentModule } from '../../components/add-tag-button/add-tag-button.component.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    RouterModule.forChild([
      { path: '', component: TagsPage },
    ]),
    AddTagButtonComponentModule,
  ],
  declarations: [TagsPage],
})
export class TagsPageModule {}
