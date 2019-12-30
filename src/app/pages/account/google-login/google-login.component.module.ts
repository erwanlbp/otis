import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoogleLoginComponent } from './google-login.component';
import { AngularFireAuthModule } from '@angular/fire/auth';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        AngularFireAuthModule,
    ],
    exports: [GoogleLoginComponent],
    declarations: [GoogleLoginComponent],
})
export class GoogleLoginComponentModule {
}
