import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-color-selector',
  templateUrl: './color-selector.component.html',
  styleUrls: ['./color-selector.component.scss'],
})
export class ColorSelectorComponent implements OnInit {
  colors: string[] = [
    '#0000XX',
    '#00XX00',
    '#XX0000',
    '#00XXXX',
    '#XX00XX',
    '#XXXX00',
    '#000000',
    '#XXXXXX',
    '#XX00FF',
    '#00XXFF',
    '#XXXXFF',
    '#0000FF',
    '#FF0000',
    '#FFXX00',
    '#FF00XX',
    '#FFXXXX',
    '#00FF00',
    '#00FFXX',
    '#XXFFXX',
  ];
  @Output() selectedColor: EventEmitter<string> = new EventEmitter<string>();
  private char = 'A';

  constructor(private popoverController: PopoverController) {}

  ngOnInit() {}

  getColors(): string[] {
    return this.colors.map(color => color.replace(/X/g, this.char));
  }

  selected(color: string) {
    this.close(color);
  }

  private close(color?: string) {
    this.popoverController.dismiss({ selected: color }, color ? 'selected' : 'cancel');
  }
}
