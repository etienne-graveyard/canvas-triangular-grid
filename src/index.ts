import Root from './renderables/Root';
import app from './app';
import TriangularGrid from './state/TriangularGrid';
// import arrow from './data/icons/arrow';
import search from './data/icons/search';
import ColorHlsaModel from './state/ColorHslaModel';
import range from './utils/range';
// import TriangularGridUtils from './utils/TriangularGridUtils';
import LineUtils from './utils/LineUtils';

declare const module: {
  hot?: {
    dispose: (cb: () => any) => any;
    accept: (cb: () => any) => any;
  };
};

const searchStr = search.map(coord => TriangularGrid.serializeCoord(coord));

const input: HTMLInputElement = document.getElementById('search-input') as any;

app.render(Root);

/**
 * Generate grid
 */

const all: Array<TriangularGrid.Coordinate> = [];

app.withEffects(({ transform, width, height, grid }) => {
  const corners = {
    toplft: transform.transform(0, 0),
    toprgh: transform.transform(width, 0),
    btmrgh: transform.transform(width, height),
    btmlft: transform.transform(0, height),
  };

  const cornersTriangular = [corners.toplft, corners.toprgh, corners.btmrgh, corners.btmlft].map(p =>
    grid.resolveTriangular(p.x, p.y)
  );

  const left = Math.floor(Math.min(...cornersTriangular.map(p => p.x)));
  const right = Math.floor(Math.max(...cornersTriangular.map(p => p.x))) + 1;
  const bottom = Math.floor(Math.min(...cornersTriangular.map(p => p.y)));
  const top = Math.floor(Math.max(...cornersTriangular.map(p => p.y))) + 1;

  range(left, right).map(x => {
    range(bottom, top).map(y => {
      (['l', 'r'] as Array<'l' | 'r'>).map(side => {
        const coord: TriangularGrid.Coordinate = { x, y, side };
        const { xbtm, xlft, xrgh, xtop } = grid.resolveRectangularSquare(coord);
        const margin = 3;
        if (xtop.y > corners.toplft.y + margin) {
          return;
        }
        if (xbtm.y < corners.btmlft.y - 2 - margin) {
          return;
        }
        if (xlft.x < corners.btmlft.x + 5 - margin) {
          return;
        }
        if (xrgh.x > corners.btmrgh.x - 5 + margin) {
          return;
        }
        all.push(coord);
      });
    });
  });
});

const mainColor = ColorHlsaModel.createResolved(232, 38, 24);

// show search icon
app.mutate((state, { t }) => {
  search.map(coord => {
    TriangularGrid.update(
      state.grid,
      coord,
      color => {
        ColorHlsaModel.mutate.transitionTo(color, t, ColorHlsaModel.createResolved(0, 0, 10), 0, 100);
        // ColorHlsaModel.transitionTo(color, t, ColorHlsaModel.createResolved(0, 0, 10), 700, 100);
        return color;
      },
      ColorHlsaModel.createStatic(t, mainColor)
    );
  });
});

input.addEventListener('focus', () => {
  app.mutate((state, { grid, width, height, t, transform }) => {
    all.map((coord, index) => {
      const coordRect = grid.resolveRectangular(coord);
      const rihgtLimit = transform.transformX(width - height / 2);
      const leftLimit = transform.transformX(height / 2);
      const dist = (() => {
        if (coordRect.x < leftLimit) {
          const deltas = LineUtils.deltas({ x: leftLimit, y: 0 }, coordRect);
          return Math.max(deltas.x, deltas.y);
        }
        if (coordRect.x > rihgtLimit) {
          const deltas = LineUtils.deltas({ x: rihgtLimit, y: 0 }, coordRect);
          return Math.max(deltas.x, deltas.y);
        }
        return Math.abs(coordRect.y);
      })();
      const linearX = Math.max(0, transform.revertX(coordRect.x));

      const delay = dist * 5 + linearX * 0.3 + Math.sin(linearX * 5) * 10;
      const maxAlpha = 0.7 + Math.random() * 0.2;
      const isSearch = searchStr.indexOf(TriangularGrid.serializeCoord(coord)) >= 0;
      const colors = isSearch
        ? {
            from: ColorHlsaModel.createResolved(0, 0, 10),
            to: ColorHlsaModel.createResolved(0, 0, 10),
          }
        : {
            from: ColorHlsaModel.setAlpha(mainColor, maxAlpha),
            to: ColorHlsaModel.setAlpha(mainColor, 0),
          };
      TriangularGrid.update(
        state.grid,
        coord,
        color => {
          ColorHlsaModel.mutate.transitionTo(color, t, colors.from, delay, 50);
          ColorHlsaModel.mutate.transitionTo(color, t, colors.to, delay + 100, 50);
          return color;
        },
        ColorHlsaModel.createStatic(t, ColorHlsaModel.setAlpha(mainColor, 0))
      );
    });
  });
});

input.addEventListener('blur', () => {
  console.log('blur');

  app.mutate((state, { grid, width, height, t, transform }) => {
    all.map((coord, index) => {
      const coordLinear = grid.resolveRectangular(coord);
      const rihgtLimit = transform.transform(width - height / 2, 0).x;
      const leftLimit = transform.transform(height / 2, 0).x;
      const dist = (() => {
        if (coordLinear.x < leftLimit) {
          const deltas = LineUtils.deltas({ x: leftLimit, y: 0 }, coordLinear);
          return Math.max(deltas.x, deltas.y);
        }
        if (coordLinear.x > rihgtLimit) {
          const deltas = LineUtils.deltas({ x: rihgtLimit, y: 0 }, coordLinear);
          return Math.max(deltas.x, deltas.y);
        }
        return Math.abs(coordLinear.y);
      })();
      const delay = (height / 2 - dist) * 5;
      const maxAlpha = 0.7 + Math.random() * 0.2;
      const isSearch = searchStr.indexOf(TriangularGrid.serializeCoord(coord)) >= 0;
      const colors = isSearch
        ? {
            from: ColorHlsaModel.createResolved(0, 0, 10),
            to: ColorHlsaModel.createResolved(0, 0, 10),
          }
        : {
            from: ColorHlsaModel.setAlpha(mainColor, maxAlpha),
            to: ColorHlsaModel.setAlpha(mainColor, 0),
          };
      TriangularGrid.update(
        state.grid,
        coord,
        color => {
          ColorHlsaModel.mutate.transitionTo(color, t, colors.from, delay, 0);
          ColorHlsaModel.mutate.transitionTo(color, t, colors.to, delay + 100, 0);
          return color;
        },
        ColorHlsaModel.createStatic(t, ColorHlsaModel.setAlpha(mainColor, 0))
      );
    });
  });
});

input.addEventListener('input', () => {
  console.log('input');

  app.mutate((state, { width, height, t, grid, transform }) => {
    // iconHue = Math.random() * 360;

    all.map((coord, index) => {
      const coordLinear = grid.resolveRectangular(coord);
      const x = coordLinear.x + width;
      const dist = Math.sqrt(x * x + coordLinear.y * coordLinear.y);
      const delay = dist;
      const maxAlpha = 0.7 + Math.random() * 0.2;
      const isSearch = searchStr.indexOf(TriangularGrid.serializeCoord(coord)) >= 0;
      const colors = isSearch
        ? {
            from: ColorHlsaModel.createResolved(0, 0, 10),
            to: ColorHlsaModel.createResolved(0, 0, 10),
          }
        : {
            from: ColorHlsaModel.setAlpha(mainColor, maxAlpha),
            to: ColorHlsaModel.setAlpha(mainColor, 0),
          };
      TriangularGrid.update(
        state.grid,
        coord,
        color => {
          ColorHlsaModel.mutate.transitionTo(color, t, colors.from, delay, 20);
          ColorHlsaModel.mutate.transitionTo(color, t, colors.to, delay + 100, 20);
          return color;
        },
        ColorHlsaModel.createStatic(t, ColorHlsaModel.setAlpha(mainColor, 0))
      );
    });

    // search.map(coord => {
    //   TriangularGrid.update(
    //     state.grid,
    //     coord,
    //     color => {
    //       ColorHlsaModel.transitionTo(color, t, ColorHlsaModel.createResolved(0, 0, 90, 0), 400, 100);
    //       ColorHlsaModel.transitionTo(color, t, ColorHlsaModel.createResolved(0, 0, 10), 700, 100);
    //       return color;
    //     },
    //     ColorHlsaModel.createStatic(t, ColorHlsaModel.createResolved(iconHue, 50, 50, 0))
    //   );
    // });

    // range(-10, 0).map(x => {
    //   TriangularGridUtils.moveAll(arrow, x).map(coord => {
    //     const delay = (x + 10) * 20;
    //     const maxAlpha = 1;
    //     TriangularGrid.update(
    //       state.grid,
    //       coord,
    //       color => {
    //         ColorHlsaModel.transitionTo(color, t, ColorHlsaModel.createResolved(iconHue, 50, 50, maxAlpha), delay, 0);
    //         ColorHlsaModel.transitionTo(color, t, ColorHlsaModel.createResolved(iconHue, 50, 50, 0), delay + 10, 100);
    //         return color;
    //       },
    //       ColorHlsaModel.createStatic(t, ColorHlsaModel.createResolved(iconHue, 50, 50, 0))
    //     );
    //   });
    // });
  });
});

if (module.hot) {
  module.hot.dispose(function() {
    console.log('destroy');
    app.destroy();
  });
}
