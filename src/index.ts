import Root from './renderables/Root';
import app from './app';
import TriangularGrid from './state/TriangularGrid';
import search from './data/icons/search';
import dots from './data/icons/dots';
import ColorHlsaModel from './state/ColorHslaModel';
import AnimatedModel from './state/AnimatedModel';
import range from './utils/range';

declare const module: {
  hot?: {
    dispose: (cb: () => any) => any;
    accept: (cb: () => any) => any;
  };
};

app.mountOnBody();
app.render(Root);

const squareSize = 20;
const square: Array<TriangularGrid.TriangularCoordinate> = [];
range(-squareSize, squareSize).map(x => {
  range(-squareSize, squareSize).map(y => {
    square.push({ x, y, side: 'r' });
    square.push({ x, y, side: 'l' });
  });
});

const icons = [search, dots, square];
let iconSwitch: number = 0;
let iconHue = Math.random() * 360;
const duration = 200;

app.mutate((state, { t }) => {
  search.map(coord => {
    const delay = getDelay(coord);
    TriangularGrid.set(
      state.grid,
      coord,
      ColorHlsaModel.createFromTo(
        t,
        ColorHlsaModel.createResolved(iconHue, 50, 100),
        ColorHlsaModel.createResolved(iconHue, 50, 50),
        delay,
        duration
      )
    );
  });
});

function getDelay(coord: TriangularGrid.TriangularCoordinate): number {
  return (Math.min(Math.abs(coord.x), Math.abs(coord.y)) + Math.abs(coord.x - coord.y)) * 50;
}

function getHue(coord: TriangularGrid.TriangularCoordinate): number {
  return ((Math.min(Math.abs(coord.x), Math.abs(coord.y)) + Math.abs(coord.x - coord.y)) * 10) % 360;
}

app.addEventListener('click', (ev, { grid, ctx, width, height, t }) => {
  // const x = ev.pageX - width / 2;
  // const y = -(ev.pageY - height / 2);
  // const coord = grid.resolve(x, y);

  iconSwitch = (iconSwitch + 1) % icons.length;
  const icon = icons[iconSwitch];

  iconHue = Math.random() * 360;

  app.mutate((state, { t }) => {
    // fade all
    TriangularGrid.entries(state.grid).map(([coord, color]) => {
      const delay = getDelay(coord);
      TriangularGrid.updateIfExist(state.grid, coord, color =>
        ColorHlsaModel.transitionTo(
          color,
          t,
          ColorHlsaModel.createResolved(AnimatedModel.resolve(color.hue, t), 50, 100),
          delay,
          duration
        )
      );
    });
    // set new icon
    icon.map(coord => {
      const delay = getDelay(coord);
      const hue = (iconHue + getHue(coord)) % 360;
      TriangularGrid.update(
        state.grid,
        coord,
        color => ColorHlsaModel.transitionTo(color, t, ColorHlsaModel.createResolved(hue, 50, 50), delay, duration),
        ColorHlsaModel.createFromTo(
          t,
          ColorHlsaModel.createResolved(hue, 50, 50, 0),
          ColorHlsaModel.createResolved(hue, 50, 50),
          delay,
          duration
        )
      );
    });

    // TriangularGrid.entries(state.grid).map(([coord, color]) => {
    //   TriangularGrid.updateIfExist(state.grid, coord, color =>
    //     ColorHlsaModel.transitionFrom(color, t, ColorHlsaModel.createResolved(iconHue, 50, 50), t, 500)
    //   );
    // });
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
