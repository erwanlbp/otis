import { Component, Input, OnInit } from '@angular/core';
import { Counter } from '../../interfaces/counter';

@Component({
    selector: 'app-counter',
    templateUrl: './counter.component.html',
    styleUrls: ['./counter.component.scss'],
})
export class CounterComponent implements OnInit {

    @Input() counter: Counter;

    constructor() {
    }

    ngOnInit() {
    }

    decrement() {
        this.counter.value--;
    }

    increment() {
        this.counter.value++;
    }
}
