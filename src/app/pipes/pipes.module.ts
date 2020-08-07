import { NgModule } from '@angular/core';
import { TimeElapsedPipe } from './time-elapsed.pipe';

@NgModule({
    imports: [],
    exports: [
        TimeElapsedPipe,
    ],
    declarations: [TimeElapsedPipe],
})
export class PipesModule {
}
