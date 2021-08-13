import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePage } from './home.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    RouterModule.forChild([
      {
        path: 'sort',
        component: HomePage,
        children: [
          {
            path: 'alphabetical',
            loadChildren: () =>
              import(
                '../../components/alphabetical-counters-list/alphabetical-counters-list.module'
              ).then(m => m.AlphabeticalCountersListModule),
          },
          {
            path: 'tags',
            loadChildren: () =>
              import(
                '../../components/counters-list-by-tags/counters-list-by-tags.module'
              ).then(m => m.CountersListByTagsModule),
          },
        ],
      },
      {
        path: '',
        redirectTo: 'sort/alphabetical',
        pathMatch: 'full',
      },
    ]),
  ],
  declarations: [HomePage],
})
export class HomePageModule {}
