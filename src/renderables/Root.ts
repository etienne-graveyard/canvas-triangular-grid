import { Renderable, connect } from '../types';
import TriangularGrid from '../state/TriangularGrid';
import Triangle from './Triangle';
// import ColorHlsaModel from '../state/ColorHslaModel';
// import AnimatedModel from '../state/AnimatedModel';
// import range from '../utils/range';

const Root: Renderable = ({ ctx, width, height, state, grid, t }) => {
  ctx.fillStyle = `white`;
  ctx.fillRect(0, 0, width, height);

  const rightMargin = 10;
  ctx.translate(width - height / 2 - rightMargin, height / 2);
  ctx.scale(1, -1);

  // axis
  // ctx.fillStyle = 'red';
  // ctx.fillRect(-width / 2, -1, width, 2);
  // ctx.fillRect(-1, -height / 2, 2, height);

  TriangularGrid.entries(state.grid).map(([coord, color]) => {
    Triangle({ coord, color });
  });
};

export default connect(Root);
