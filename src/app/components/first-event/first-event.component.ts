import { Component, OnInit } from '@angular/core';
import { Counter } from '../../interfaces/counter';
import { NavParams } from '@ionic/angular';
import { EventService } from '../../services/event.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-first-event',
  templateUrl: './first-event.component.html',
  styleUrls: ['./first-event.component.scss'],
})
export class FirstEventComponent implements OnInit {
  firstEvent$: Observable<number>;

  constructor(private eventService: EventService, private navParams: NavParams) {}

  ngOnInit() {
    const counter: Counter = this.navParams.get('counter');
    this.firstEvent$ = this.eventService.fetchFirstEvent$(counter.name).pipe(map(event => event.timestamp));
  }
}
