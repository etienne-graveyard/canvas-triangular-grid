import { TApp } from '../app';

namespace TransformUtils {
  type Options = {
    x: (size: { width: number; height: number }) => number;
    y: (size: { width: number; height: number }) => number;
  };

  export type Output = {
    apply: () => void;
    reverse: (x: number, y: number) => { x: number; y: number };
  };

  export function create(options: Options, app: TApp): Output {
    let applyed: boolean = false;

    app.onFrameStart(() => {
      applyed = false;
    });

    const reverseConnected = app.connect<{ x: number; y: number }, { x: number; y: number }>(
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

    return {
      apply: app.connect(({ ctx, width, height }) => {
        applyed = true;
        ctx.translate(options.x({ width, height }), options.y({ width, height }));
        ctx.scale(1, -1);
      }),
      reverse: (x, y) => reverseConnected({ x, y }),
    };
  }
}

export default TransformUtils;
