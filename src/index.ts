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

let iconHue = Math.random() * 360;

app.mutate((state, { t }) => {
  search.map(coord => {
    TriangularGrid.set(
      state.grid,
      coord,
      ColorHlsaModel.createFromTo(
        ColorHlsaModel.createResolved(iconHue, 50, 50, 0),
        ColorHlsaModel.createResolved(iconHue, 50, 50),
        t,
        500
      )
    );
  });
});

app.addEventListener('click', (ev, { grid, ctx, width, height }) => {
  // const x = ev.pageX - width / 2;
  // const y = -(ev.pageY - height / 2);
  // const coord = grid.resolve(x, y);

  iconHue = Math.random() * 360;

  app.mutate((state, { t }) => {
    TriangularGrid.entries(state.grid).map(([coord, color]) => {
      TriangularGrid.updateIfExist(state.grid, coord, color =>
        ColorHlsaModel.transitionFrom(color, t, ColorHlsaModel.createResolved(iconHue, 50, 50), t, 500)
      );
    });
    // if (TriangularGrid.has(state.grid, coord)) {
    //   TriangularGrid.updateIfExist(state.grid, coord, elem =>
    //     ColorHlsaModel.transitionFrom(elem, t, ColorHlsaModel.createResolved(iconHue, 50, 50), t, 2000)
    //   );
    // } else {
    //   TriangularGrid.set(
    //     state.grid,
    //     coord,
    //     ColorHlsaModel.createFromTo(
    //       ColorHlsaModel.createResolved(Math.random() * 360, 50, 50, 0),
    //       ColorHlsaModel.createResolved(Math.random() * 360, 50, 50),
    //       t,
    //       2000
    //     )
    //   );
    // }
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
