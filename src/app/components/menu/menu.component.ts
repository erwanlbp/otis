import { Component } from '@angular/core';
import { RouteConstants } from '../../constants/route.constants';

@Component({
    selector: 'app-menu',
    templateUrl: 'menu.component.html',
    styleUrls: ['menu.component.scss']
})
export class MenuComponent {

    pages = [
        {
            title: 'Compteurs',
            url: RouteConstants.HOME,
            icon: 'home'
        },
        {
            title: 'Profile',
            url: RouteConstants.ACCOUNT,
            icon: 'person'
        },
        {
            title: 'Evénements',
            url: RouteConstants.COUNTER_EVENTS,
            icon: 'analytics'
        }
    ];

    constructor() {
    }
}
