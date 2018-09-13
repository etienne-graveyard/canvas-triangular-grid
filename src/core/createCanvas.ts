type Output = {
  el: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
};

export function createCanvas(width: number, height: number, density: number = 1): Output {
  const el = document.createElement('canvas');
  el.height = height / density;
  el.width = width / density;
  const ctx = el.getContext('2d');
  return { el, ctx: ctx as any };
}

export function setupCanvas(el: HTMLCanvasElement, width: number, height: number, density: number = 1): Output {
  el.height = height / density;
  el.width = width / density;
  const ctx = el.getContext('2d');
  return { el, ctx: ctx as any };
}
