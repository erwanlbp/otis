export class CounterTag {
  constructor(public counter: string, public tag: string) {}

  static from(dto: CounterTagFirebaseDto): CounterTag | null {
    if (!dto) {
      return null;
    }
    return new CounterTag(dto.counter, dto.tag);
  }

  toFirebaseDto(): CounterTagFirebaseDto | null {
    return {
      counter: this.counter,
      tag: this.tag,
    };
  }
}

export interface CounterTagFirebaseDto {
  counter: string;
  tag: string;
}
