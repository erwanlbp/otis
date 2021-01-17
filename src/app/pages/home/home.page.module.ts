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
        path: '',
        component: HomePage,
        children: [
          {
            path: 'alphabetical',
            loadChildren: () =>
              import(
                '../../components/alphabetical-counters-list/alphabetical-counters-list.module'
              ).then(m => m.AlphabeticalCountersListModule),
          },
        ],
      },
    ]),
  ],
  declarations: [HomePage],
})
export class HomePageModule {}
