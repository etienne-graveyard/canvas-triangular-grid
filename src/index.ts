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

let iconHue = Math.random() * 360;

input.addEventListener('input', () => {
  console.log('input');

  app.mutate((state, { width, height, t, grid }) => {
    iconHue = Math.random() * 360;

    const all: Array<TriangularGrid.Coordinate> = [];

    range(-20, 5).map(x => {
      range(-5, 5).map(y => {
        (['l', 'r'] as Array<'l' | 'r'>).map(side => {
          const coord: TriangularGrid.Coordinate = { x, y, side };
          const { xbtm, xlft, xrgh, xtop } = grid.resolveFour(coord);
          if (xtop[1] > (height - 20) / 2) {
            return;
          }
          if (xbtm[1] < -(height - 20) / 2) {
            return;
          }
          if (xlft[0] < -(width - 20) / 2) {
            return;
          }
          if (xrgh[0] > (width - 20) / 2) {
            return;
          }
          all.push(coord);
        });
      });
    });

    all.map(coord => {
      TriangularGrid.update(
        state.grid,
        coord,
        color => {
          ColorHlsaModel.transitionTo(color, t, ColorHlsaModel.createResolved(iconHue, 50, 50, 1), 0, 200);
          // ColorHlsaModel.transitionTo(color, t, ColorHlsaModel.createResolved(iconHue, 50, 50, 0), 10, 100);
          return color;
        },
        ColorHlsaModel.createStatic(t, ColorHlsaModel.createResolved(iconHue, 50, 50, 0))
      );
    });

    // search.map(coord => {
    //   const delay = 0;
    //   const maxAlpha = 1;
    //   TriangularGrid.update(
    //     state.grid,
    //     coord,
    //     color => {
    //       ColorHlsaModel.transitionTo(color, t, ColorHlsaModel.createResolved(iconHue, 50, 50, maxAlpha), delay, 0);
    //       ColorHlsaModel.transitionTo(color, t, ColorHlsaModel.createResolved(iconHue, 50, 50, 0), delay + 10, 100);
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
