import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoggedInGuard } from './guards/logged-in.guard';

const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', children: [{ path: '', loadChildren: () => import('./pages/home/home.page.module').then(m => m.HomePageModule) }], canActivate: [LoggedInGuard] },
    { path: 'account', children: [{ path: '', loadChildren: () => import('./pages/account/account.page.module').then(m => m.AccountPageModule) }] },
    { path: 'counter-events', children: [{ path: '', loadChildren: () => import('./pages/counter-events/counter-events.page.module').then(m => m.CounterEventsPageModule) }] },
    { path: 'counter-chart', children: [{ path: '', loadChildren: () => import('./pages/counter-chart/counter-chart.page.module').then(m => m.CounterChartPageModule) }] },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
