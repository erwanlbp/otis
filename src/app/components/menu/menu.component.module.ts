import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuComponent } from './menu.component';
import { RouterModule, Routes } from '@angular/router';
import { LoggedInGuard } from '../../guards/logged-in.guard';

const routes: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: 'home', children: [{path: '', loadChildren: () => import('../../pages/home/home.page.module').then(m => m.HomePageModule)}], canActivate: [LoggedInGuard]},
    {path: 'account', children: [{path: '', loadChildren: () => import('../../pages/account/account.page.module').then(m => m.AccountPageModule)}]},
    {path: 'counter-events', children: [{path: '', loadChildren: () => import('../../pages/counter-events/counter-events.page.module').then(m => m.CounterEventsPageModule)}]},
];

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild(routes),
    ],
    declarations: [MenuComponent],
    exports: [MenuComponent],
})
export class MenuComponentModule {
}
