import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';

@Component({
    selector: 'app-counter-more-popover',
    templateUrl: './counter-more-popover.component.html',
    styleUrls: ['./counter-more-popover.component.scss'],
})
export class CounterMorePopoverComponent implements OnInit {

    constructor(
        private navParams: NavParams,
        private popoverController: PopoverController,
    ) {
    }

    ngOnInit() {
    }

    async events() {
        await this.popoverController.dismiss('events');
    }

    async delete() {
        await this.popoverController.dismiss('delete');
    }
}
