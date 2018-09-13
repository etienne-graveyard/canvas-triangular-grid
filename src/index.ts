import Root from './renderables/Root';
import app from './app';
import TriangularGrid from './state/TriangularGrid';
import arrow from './data/icons/arrow';
import search from './data/icons/search';
import ColorHlsaModel from './state/ColorHslaModel';
import range from './utils/range';
import TriangularGridUtil from './utils/TriangularGridUtil';

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

  app.mutate((state, { width, height, t }) => {
    iconHue = Math.random() * 360;

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

    range(-10, 0).map(x => {
      TriangularGridUtil.moveAll(arrow, x).map(coord => {
        const delay = (x + 10) * 20;
        const maxAlpha = 1;
        TriangularGrid.update(
          state.grid,
          coord,
          color => {
            ColorHlsaModel.transitionTo(color, t, ColorHlsaModel.createResolved(iconHue, 50, 50, maxAlpha), delay, 0);
            ColorHlsaModel.transitionTo(color, t, ColorHlsaModel.createResolved(iconHue, 50, 50, 0), delay + 10, 100);
            return color;
          },
          ColorHlsaModel.createStatic(t, ColorHlsaModel.createResolved(iconHue, 50, 50, 0))
        );
      });
    });
  });
});

if (module.hot) {
  module.hot.dispose(function() {
    console.log('destroy');
    app.destroy();
  });
}
