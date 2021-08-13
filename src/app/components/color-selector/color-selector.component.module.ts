import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ColorSelectorComponent } from './color-selector.component';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule],
  exports: [ColorSelectorComponent],
  declarations: [ColorSelectorComponent],
  entryComponents: [ColorSelectorComponent],
})
export class ColorSelectorComponentModule {}
