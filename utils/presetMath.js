function calculateRampCurve() {
  const steps = 15;
  const distance = 100;
  const height = 30;

  const startX = 0;
  const startY = 45;

  for (var i = 0; i <= steps; i++) {
    const angleForY = -Math.PI + (Math.PI * (i / steps));
    const angleForX = -Math.PI * .5 + (Math.PI * .5 * (i/steps));
    const x = Math.round(startX + Math.abs(Math.cos(angleForX) * distance));
    const y = Math.round(startY + Math.sin(angleForY) * height);
    console.log(`[${x}, ${y}],`);
  }
}

calculateRampCurve();