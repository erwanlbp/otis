import { NgModule } from '@angular/core';
import { TimeElapsedPipe } from './time-elapsed.pipe';
import { DurationPipe } from './duration.pipe';

@NgModule({
    imports: [],
    declarations: [
        TimeElapsedPipe,
        DurationPipe,
    ],
    exports: [
        DurationPipe,
        TimeElapsedPipe,
    ],
})
export class PipesModule {
}
