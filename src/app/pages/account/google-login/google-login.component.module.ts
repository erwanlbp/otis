import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoogleLoginComponent } from './google-login.component';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule],
  exports: [GoogleLoginComponent],
  declarations: [GoogleLoginComponent],
})
export class GoogleLoginComponentModule {}
