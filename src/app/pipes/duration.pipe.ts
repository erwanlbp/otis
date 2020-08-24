import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

import momentDurationFormatSetup from 'moment-duration-format';

momentDurationFormatSetup(moment);

@Pipe({
    name: 'duration',
})
export class DurationPipe implements PipeTransform {

    transform(duration: moment.Duration): string {
        if (!duration) {
            return '--';
        }
        return duration.format();
    }
}
