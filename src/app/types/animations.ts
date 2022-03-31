type AnimationFrame = [
  path: string,
  ticks: number,
  x: number,
  y: number,
  condition?: Function
];

const findAnimation = (
  animations: Array<AnimationFrame>,
  path: string,
  ticks: number
) => {
  return animations.find(
    (animation) => animation[0] === path && animation[1] === ticks
  );
};

export { AnimationFrame, findAnimation };
