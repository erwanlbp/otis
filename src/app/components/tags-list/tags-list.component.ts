import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { TagService } from '../../services/tag.service';
import { Tag } from '../../interfaces/tag';
import { map, takeUntil } from 'rxjs/operators';

interface TagSelected {
  tag: Tag;
  selected: boolean;
}

@Component({
  selector: 'app-tags-list',
  templateUrl: './tags-list.component.html',
  styleUrls: ['./tags-list.component.scss'],
})
export class TagsListComponent implements OnInit, OnDestroy {
  @Input() grayWhenNoSelected: boolean = false;
  @Input() withClearButton: boolean = false;
  @Input() withIcons: boolean = false;
  @Input() withAddButton: boolean = false;

  @Output() tagsSelected: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output() clickedOnTag: EventEmitter<TagSelected> = new EventEmitter<TagSelected>();
  @Output() clickedOnRemoveButton: EventEmitter<Tag> = new EventEmitter<Tag>();

  tags$: BehaviorSubject<TagSelected[]> = new BehaviorSubject([]);
  destroyed$: Subject<void> = new Subject<void>();

  constructor(private tagService: TagService) {}

  ngOnInit() {
    this.tagService
      .fetchTags$()
      .pipe(
        map(tags =>
          tags.map(tag => {
            return { tag, selected: false };
          }),
        ),
        takeUntil(this.destroyed$),
      )
      .subscribe(tags => {
        this.tags$.next(tags);
        this.emitTagsSelected();
      });
  }

  tagSelected(tag: TagSelected, emitAllSelected: boolean = true) {
    tag.selected = !tag.selected;
    this.clickedOnTag.emit(tag);
    if (emitAllSelected) {
      this.emitTagsSelected();
    }
  }

  removeTag(tag: TagSelected, event: Event) {
    event.stopPropagation();
    this.clickedOnRemoveButton.emit(tag.tag);
  }

  reset(selected: boolean) {
    this.tags$.value.filter(tag => tag.selected !== selected).forEach(tag => this.tagSelected(tag, false));
    this.emitTagsSelected();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.unsubscribe();
  }

  isAnyTagSelected(): boolean {
    return !!this.tags$.value.find(tag => tag.selected);
  }

  private emitTagsSelected(): void {
    this.tagsSelected.emit(this.tags$.value.filter(tag => tag.selected).map(tag => tag.tag.name));
  }
}
