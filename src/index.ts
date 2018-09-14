import Root from './renderables/Root';
import app from './app';
import TriangularGrid from './state/TriangularGrid';
import arrow from './data/icons/arrow';
import search from './data/icons/search';
import ColorHlsaModel from './state/ColorHslaModel';
import range from './utils/range';
import TriangularGridUtils from './utils/TriangularGridUtils';

declare const module: {
  hot?: {
    dispose: (cb: () => any) => any;
    accept: (cb: () => any) => any;
  };
};

const input: HTMLInputElement = document.getElementById('search-input') as any;

app.render(Root);

/**
 * Generate grid
 */

const all: Array<TriangularGrid.Coordinate> = [];

app.withEffects(({ transform, width, height, grid }) => {
  const corners = {
    toplft: transform.reverse(0, 0),
    toprgh: transform.reverse(width, 0),
    btmrgh: transform.reverse(width, height),
    btmlft: transform.reverse(0, height),
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
        const { xbtm, xlft, xrgh, xtop } = grid.resolveLinearSquare(coord);
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

let iconHue = Math.random() * 360;

input.addEventListener('input', () => {
  console.log('input');

  app.mutate((state, { width, height, t, grid, transform }) => {
    // iconHue = Math.random() * 360;

    all.map((coord, index) => {
      const coordLinear = grid.resolveLiniear(coord);
      const x = coordLinear.x + width;
      const dist = Math.sqrt(x * x + coordLinear.y * coordLinear.y);
      const delay = dist;
      const maxAlpha = 0.7 + Math.random() * 0.2;
      TriangularGrid.update(
        state.grid,
        coord,
        color => {
          ColorHlsaModel.transitionTo(color, t, ColorHlsaModel.createResolved(iconHue, 50, 50, maxAlpha), delay, 50);
          ColorHlsaModel.transitionTo(color, t, ColorHlsaModel.createResolved(iconHue, 50, 50, 0), delay + 50, 100);
          return color;
        },
        ColorHlsaModel.createStatic(t, ColorHlsaModel.createResolved(iconHue, 50, 50, 0))
      );
    });

    search.map(coord => {
      TriangularGrid.update(
        state.grid,
        coord,
        color => {
          ColorHlsaModel.transitionTo(color, t, ColorHlsaModel.createResolved(0, 0, 90, 0), 400, 100);
          ColorHlsaModel.transitionTo(color, t, ColorHlsaModel.createResolved(0, 0, 10), 700, 100);
          return color;
        },
        ColorHlsaModel.createStatic(t, ColorHlsaModel.createResolved(iconHue, 50, 50, 0))
      );
    });

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
