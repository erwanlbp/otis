import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { UtilsService } from '../../services/utils.service';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { TagService } from '../../services/tag.service';
import { Tag } from '../../interfaces/tag';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-add-tag',
  templateUrl: './add-tag-button.component.html',
  styleUrls: ['./add-tag-button.component.scss'],
})
export class AddTagButtonComponent implements OnInit {
  connected$: Observable<boolean>;

  constructor(
    private tagService: TagService,
    private alertController: AlertController,
    private utilsService: UtilsService,
    private loader: LoaderService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.connected$ = this.authService.isConnected$();
  }

  addTag() {
    this.askForNameAndColor().then(tag => {
      if (!tag) {
        return;
      }
      return this.loader
        .showLoader('Sauvegarde ...')
        .then(() => this.tagService.saveTag(tag))
        .catch(err => {
          console.error('echec sauvegarde tag ::', err);
          return this.utilsService.showToast('Echec lors de la sauvegarde');
        })
        .then(() => this.loader.dismissLoader());
    });
  }

  private async askForNameAndColor(): Promise<Tag | null> {
    const alert = await this.alertController.create({
      header: 'Nouveau tag',
      inputs: [
        {
          placeholder: 'Nom du tag',
          type: 'text',
          name: 'name',
        },
      ],
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Confirmer',
          role: 'validate',
          handler: data => this.isValid(data),
        },
      ],
    });
    alert.present();
    return alert.onDidDismiss().then(({ role, data }) => {
      if (role !== 'validate') {
        return;
      }
      return new Tag(data.values.name, Tag.DEFAULT_COLOR);
    });
  }

  private isValid(data: { name: string }): boolean {
    if (!data.name) {
      this.utilsService.showToast('Le nom est obligatoire');
      return false;
    }
    if (data.name.length < 1 || data.name.length > 20) {
      this.utilsService.showToast('Le nom doit faire entre 1 et 20 caractères');
      return false;
    }
    return true;
  }
}
