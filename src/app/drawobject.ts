type objectType =
  | 'boundary'
  | 'ball'
  | 'bumper'
  | 'gate'
  | 'toggle'
  | 'stopper'
  | 'stopper-foreground';

interface DrawObjectOptions {
  id: number;
  x: number;
  y: number;
  type: objectType;
  width?: number;
  height?: number;
  onClickHandler?: Function;
  flipped?: boolean;
  color?: string;
}

interface DrawObjectStyles {
  left: string;
  top: string;
  width?: string;
  height?: string;
}

export class DrawObject {
  id: number;
  className: string;
  styleObject: DrawObjectStyles;
  onClickHandler: Function | undefined;

  constructor(properties: DrawObjectOptions) {
    this.id = properties.id;

    this.styleObject = {
      left: properties.x + 'px',
      top: properties.y + 'px',
      ...(properties.width ? { width: properties.width + 'px' } : {}),
      ...(properties.height ? { height: properties.height + 'px' } : {}),
    };
    this.className = `${properties.type}${
      properties.flipped ? ' flipped' : ''
    }${properties.color ? ` ${properties.color}` : ''}`;
    this.onClickHandler = properties.onClickHandler;
  }

  onClick() {
    if (this.onClickHandler) {
      this.onClickHandler();
    }
  }
}
