import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Counter } from '../interfaces/counter';

@Injectable({
    providedIn: 'root'
})
export class CounterService {

    constructor() {
    }

    fetchCounters(): Observable<Counter[]> {
        return of(
            [
                {name: 'Patates', value: 5},
                {name: 'Patates', value: 5},
                {name: 'Patates', value: 5},
                {name: 'Patates', value: 5},
                {name: 'Patates', value: 5},
                {name: 'Patates', value: 5},
                {name: 'Patates', value: 5},
                {name: 'Patates', value: 5},
                {name: 'Patates', value: 5},
                {name: 'Patates', value: 5},
                null,
            ]
        );
    }
}
