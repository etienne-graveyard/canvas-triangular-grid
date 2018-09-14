import { TApp } from '../app';

namespace TransformUtils {
  type Options = {
    x: (size: { width: number; height: number }) => number;
    y: (size: { width: number; height: number }) => number;
  };

  export type Output = {
    apply: () => void;
    // from initial to transformed
    transform: (x: number, y: number) => { x: number; y: number };
    transformX: (x: number) => number;
    transformY: (y: number) => number;
    // from transformed to initial
    revert: (x: number, y: number) => { x: number; y: number };
    revertX: (x: number) => number;
    revertY: (y: number) => number;
  };

  export function create(options: Options, app: TApp): Output {
    let applyed: boolean = false;

    app.onFrameStart(() => {
      applyed = false;
    });

    const transformConnected = app.connect<{ x: number; y: number }, { x: number; y: number }>(
      ({ width, height, x, y }) => {
        if (applyed === false) {
          console.warn(`Transform was not applyed !`);
        }
        return {
          x: x - options.x({ width, height }),
          y: -(y - options.y({ width, height })),
        };
      }
    );

    const revertConnected = app.connect<{ x: number; y: number }, { x: number; y: number }>(
      ({ width, height, x, y }) => {
        if (applyed === false) {
          console.warn(`Transform was not applyed !`);
        }
        return {
          x: x + options.x({ width, height }),
          y: -(y + options.y({ width, height })),
        };
      }
    );

    return {
      apply: app.connect(({ ctx, width, height }) => {
        applyed = true;
        ctx.translate(options.x({ width, height }), options.y({ width, height }));
        ctx.scale(1, -1);
      }),
      transform: (x, y) => transformConnected({ x, y }),
      transformX: x => transformConnected({ x, y: 0 }).x,
      transformY: y => transformConnected({ x: 0, y }).y,
      revert: (x, y) => revertConnected({ x, y }),
      revertX: x => revertConnected({ x, y: 0 }).x,
      revertY: y => revertConnected({ x: 0, y }).y,
    };
  }
}

export default TransformUtils;
