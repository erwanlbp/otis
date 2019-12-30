import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabsPage } from './tabs.page';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: 'tabs',
        component: TabsPage,
        children: [
            {path: '', redirectTo: '/tabs/home', pathMatch: 'full'},
            {path: 'home', children: [{path: '', loadChildren: () => import('../pages/home/home.page.module').then(m => m.HomePageModule)}]},
            {path: 'account', children: [{path: '', loadChildren: () => import('../pages/account/account.page.module').then(m => m.AccountPageModule)}]},
        ]
    },
    {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild(routes),
    ],
    declarations: [TabsPage],
})
export class TabsPageModule {
}
