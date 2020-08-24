import { Pipe, PipeTransform } from '@angular/core';
import { interval, Observable, of } from 'rxjs';
import * as moment from 'moment';
import { map, take } from 'rxjs/operators';

@Pipe({
    name: 'timeElapsed',
})
export class TimeElapsedPipe implements PipeTransform {

    transform(value: number): Observable<string> {
        if (!value) {
            return of('--').pipe(take(1));
        }
        return interval(5000).pipe(map(() => moment.duration(new Date().getTime() - value).format()));
    }
}
