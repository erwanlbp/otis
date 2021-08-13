import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CountersListByTagsComponent } from './counters-list-by-tags.component';
import { CounterComponentModule } from '../counter/counter.component.module';
import { AddCounterComponentModule } from '../add-counter-button/add-counter.component.module';
import { TimeCounterComponentModule } from '../time-counter/time-counter.component.module';
import { TagsListComponentModule } from '../tags-list/tags-list.component.module';
import { AddTagButtonComponentModule } from '../add-tag-button/add-tag-button.component.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: CountersListByTagsComponent,
      },
    ]),
    CounterComponentModule,
    AddCounterComponentModule,
    TimeCounterComponentModule,
    AddTagButtonComponentModule,
    TagsListComponentModule,
  ],
  declarations: [CountersListByTagsComponent],
})
export class CountersListByTagsModule {}
