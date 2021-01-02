import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountPage } from './account.page';
import { GoogleLoginComponentModule } from './google-login/google-login.component.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      { path: '', component: AccountPage },
    ]),
    // GoogleLoginComponentModule,
    GoogleLoginComponentModule,
  ],
  declarations: [AccountPage],
})
export class AccountPageModule {}
