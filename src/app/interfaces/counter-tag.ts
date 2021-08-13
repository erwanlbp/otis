export class CounterTag {
  constructor(public counter: string, public tag: string) {}

  static from(dto: CounterTagFirebaseDto): CounterTag | null {
    if (!dto) {
      return null;
    }
    return new CounterTag(dto.counter, dto.tag);
  }

  static mapByCounter(countersTags: CounterTag[]): Map<string, string[]> {
    const map = new Map<string, string[]>();
    countersTags.forEach(counterTag => {
      const existingValue = map.get(counterTag.counter) || [];
      existingValue.push(counterTag.tag);
      map.set(counterTag.counter, existingValue);
    });
    return map;
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
