import Root from './renderables/Root';
import app from './app';
import TriangularGrid from './state/TriangularGrid';
import arrow from './data/icons/arrow';
import ColorHlsaModel from './state/ColorHslaModel';
import range from './utils/range';
import TriangularGridUtil from './utils/TriangularGridUtil';

declare const module: {
  hot?: {
    dispose: (cb: () => any) => any;
    accept: (cb: () => any) => any;
  };
};

app.mountOnBody();
app.render(Root);

let iconHue = Math.random() * 360;

app.addEventListener('click', (ev, { grid, ctx, width, height, t }) => {
  iconHue = Math.random() * 360;

  app.mutate((state, { t }) => {
    range(-20, 20).map(x => {
      TriangularGridUtil.moveAll(arrow, x).map(coord => {
        const delay = (x + 20) * 20;
        const maxAlpha = Math.min((x - -20) * 0.2, 1);
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
