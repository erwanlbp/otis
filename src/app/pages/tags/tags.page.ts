import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Tag } from '../../interfaces/tag';
import { TagService } from '../../services/tag.service';
import { UtilsService } from '../../services/utils.service';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-tags',
  templateUrl: 'tags.page.html',
  styleUrls: ['tags.page.scss'],
})
export class TagsPage implements OnInit {
  tags$: Observable<Tag[]>;

  constructor(private tagService: TagService, private loaderService: LoaderService, private utilsService: UtilsService) {}

  ngOnInit() {
    this.tags$ = this.tagService.fetchTags$();
  }

  deleteTag(tag: Tag) {
    this.utilsService
      .askForConfirmation(`Voulez vous supprimer le tag <b>${tag.name}</b> ?<br/><br/>Ceci ne supprimera pas les compteurs associés`)
      .then(confirmed => {
        if (!confirmed) {
          return;
        }
        return this.loaderService
          .showLoader('Suppression ...')
          .then(() => this.tagService.deleteTag(tag))
          .catch(err => {
            console.error('Failed deleting tag ::', err);
            this.utilsService.showToast('Echec de la suppression');
          })
          .then(() => this.loaderService.dismissLoader());
      });
  }
}
