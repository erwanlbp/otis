import { Pipe, PipeTransform } from '@angular/core';
import { interval, Observable, of } from 'rxjs';
import * as moment from 'moment';
import { map, startWith, take } from 'rxjs/operators';

@Pipe({
  name: 'timeElapsed',
})
export class TimeElapsedPipe implements PipeTransform {
  private static convert(value: number): string {
    return moment.duration(new Date().getTime() - value).format();
  }

  transform(value: number): Observable<string> {
    if (!value) {
      return of('--').pipe(take(1));
    }
    return interval(1000).pipe(
      map(() => TimeElapsedPipe.convert(value)),
      startWith(TimeElapsedPipe.convert(value)),
    );
  }
}
