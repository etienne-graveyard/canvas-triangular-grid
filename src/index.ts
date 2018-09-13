import Root from './renderables/Root';
import app from './app';
import TriangularGrid from './state/TriangularGrid';
import search from './data/icons/search';
import ColorHlsaModel from './state/ColorHslaModel';

declare const module: {
  hot?: {
    dispose: (cb: () => any) => any;
    accept: (cb: () => any) => any;
  };
};

app.mountOnBody();
app.render(Root);

app.mutate((state, { t }) => {
  search.map(coord => {
    TriangularGrid.set(
      state.grid,
      coord,
      ColorHlsaModel.createFromTo(
        ColorHlsaModel.createResolved(Math.random() * 360, 50, 50, 0),
        ColorHlsaModel.createResolved(Math.random() * 360, 50, 50),
        t,
        2000
      )
    );
  });
});

app.addEventListener('click', (ev, { grid, ctx, width, height }) => {
  const x = ev.clientX - width / 2;
  const y = -(ev.clientY - height / 2);
  const coord = grid.resolve(x, y);
  app.mutate((state, { t }) => {
    if (TriangularGrid.has(state.grid, coord)) {
      TriangularGrid.updateIfExist(state.grid, coord, elem =>
        ColorHlsaModel.transitionFrom(elem, t, ColorHlsaModel.createResolved(Math.random() * 360, 50, 50), t, 2000)
      );
    } else {
      TriangularGrid.set(
        state.grid,
        coord,
        ColorHlsaModel.createFromTo(
          ColorHlsaModel.createResolved(Math.random() * 360, 50, 50, 0),
          ColorHlsaModel.createResolved(Math.random() * 360, 50, 50),
          t,
          2000
        )
      );
    }
  });
});

(window as any).getData = () => {
  console.log(
    JSON.stringify(
      TriangularGrid.entries(app.getState().grid)
        .filter(en => en[1])
        .map(en => en[0])
    )
  );
};

if (module.hot) {
  module.hot.dispose(function() {
    console.log('destroy');
    app.destroy();
  });
}
