import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../../services/utils.service';
import { LoaderService } from '../../services/loader.service';
import { Counter } from '../../interfaces/counter';
import { TagService } from '../../services/tag.service';
import { combineLatest, Observable } from 'rxjs';
import { Tag } from '../../interfaces/tag';
import { ModalController, NavParams } from '@ionic/angular';
import { map } from 'rxjs/operators';

class TagWithCounterSelected extends Tag {
  constructor(tag: Tag, public selectedOnCounter: boolean) {
    super(tag.name, tag.color);
    this.selectedOnCounter = selectedOnCounter;
  }
}

@Component({
  selector: 'app-tags-edit',
  templateUrl: './tags-edit.component.html',
  styleUrls: ['./tags-edit.component.scss'],
})
export class TagsEditComponent implements OnInit {
  counter: Counter;
  tags$: Observable<TagWithCounterSelected[]>;

  constructor(
    private tagService: TagService,
    private modalController: ModalController,
    private utilsService: UtilsService,
    private loaderService: LoaderService,
    private navParams: NavParams,
  ) {}

  ngOnInit() {
    this.counter = this.navParams.get('counter');
    this.tags$ = combineLatest([this.tagService.fetchTags$(), this.tagService.fetchCounterTags$(this.counter)]).pipe(
      map(([tags, counterTags]) => {
        return tags.map(tag => {
          return new TagWithCounterSelected(tag, !!counterTags.find(counterTag => counterTag.tag === tag.name));
        });
      }),
    );
  }

  close() {
    this.modalController.dismiss();
  }

  tagChecked(tag: Tag, checked: boolean) {
    this.loaderService
      .showLoader('Sauvegarde ...')
      .then(() => {
        if (checked) {
          return this.tagService.addTagToCounter(tag, this.counter);
        } else {
          return this.tagService.removeTagFromCounter(tag, this.counter);
        }
      })
      .catch(err => {
        console.error('failed saving checked on counter tag ::', err);
        this.utilsService.showToast('Echec de la sauvegarde');
      })
      .then(() => this.loaderService.dismissLoader());
  }
}
