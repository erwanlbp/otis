export class Tag {
  static DEFAULT_COLOR: string = '#777777';

  constructor(public name: string, public color: string) {}

  static from(tagDto: TagFirebaseDto): Tag | null {
    if (!tagDto) {
      return null;
    }
    return new Tag(tagDto.name, tagDto.color);
  }

  toFirebaseDto(): TagFirebaseDto | null {
    return {
      name: this.name,
      color: this.color,
    };
  }
}

export interface TagFirebaseDto {
  name: string;
  color: string;
}
