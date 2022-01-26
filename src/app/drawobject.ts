type objectType = 'ball' | 'bumper';

interface DrawObjectOptions {
  x: number;
  y: number;
  type: objectType;
}

interface DrawObjectStyles {
  left: string;
  top: string;
}

export class DrawObject {
  className: objectType;
  styleObject: DrawObjectStyles;

  constructor(properties: DrawObjectOptions) {
    this.styleObject = { left: properties.x + 'px', top: properties.y + 'px' };
    this.className = properties.type;
  }
}
