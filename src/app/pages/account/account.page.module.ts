import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountPage } from './account.page';
import { RegisterEmailPasswordComponentModule } from './register-email-password/register-email-password.component.module';
import { GoogleLoginComponentModule } from "./google-login/google-login.component.module";

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild([{path: '', component: AccountPage}]),
        // GoogleLoginComponentModule,
        RegisterEmailPasswordComponentModule,
        GoogleLoginComponentModule
    ],
    declarations: [AccountPage]
})
export class AccountPageModule {
}
