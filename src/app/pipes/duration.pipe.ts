import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
    name: 'duration',
})
export class DurationPipe implements PipeTransform {

    transform(duration: moment.Duration): string {
        if (!duration) {
            return '--';
        }
        let res = '';
        if (duration.days() > 0) {
            res += duration.days() + 'j';
        }
        if (duration.hours() > 0) {
            res += duration.hours() + 'h';
        }
        if (duration.minutes() > 0) {
            res += duration.minutes() + 'min';
        }
        return res;
    }
}
