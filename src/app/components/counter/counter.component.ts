import { Component, Input, OnInit } from '@angular/core';
import { Counter } from '../../interfaces/counter';
import { CounterService } from '../../services/counter.service';
import { UtilsService } from '../../services/utils.service';

@Component({
    selector: 'app-counter',
    templateUrl: './counter.component.html',
    styleUrls: ['./counter.component.scss'],
})
export class CounterComponent implements OnInit {

    @Input() counter: Counter;

    constructor(
        private counterService: CounterService,
        private utilsService: UtilsService,
    ) {
    }

    ngOnInit() {
    }

    decrement() {
        this.counter.value--;
        this.counterService.saveCounter(this.counter);
    }

    increment() {
        this.counter.value++;
        this.counterService.saveCounter(this.counter);
    }

    async delete() {
        this.utilsService.askForConfirmation()
            .then(confirmed => {
                if (!confirmed) {
                    return;
                }
                this.counterService.deleteCounter(this.counter);
            });
    }
}
