import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Tag } from '../../interfaces/tag';
import { TagService } from '../../services/tag.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tags',
  templateUrl: 'tags.page.html',
  styleUrls: ['tags.page.scss'],
})
export class TagsPage implements OnInit {
  tags$: Observable<Tag[]>;

  constructor(private tagService: TagService, private alertController: AlertController) {}

  ngOnInit() {
    this.tags$ = this.tagService.fetchTags$();
  }
}
