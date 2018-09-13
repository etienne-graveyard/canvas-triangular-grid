import { Renderable, connect } from '../types';
import TriangularGrid from '../state/TriangularGrid';
import ColorHlsaModel from '../state/ColorHslaModel';
import AnimatedModel from '../state/AnimatedModel';
import Triangle from './Triangle';
// import range from '../utils/range';

const Root: Renderable = ({ ctx, width, height, state, grid, t }) => {
  ctx.fillStyle = `white`;
  ctx.fillRect(0, 0, width, height);

  ctx.translate(width / 2, height / 2);
  ctx.scale(1, -1);

  // axis
  // ctx.fillStyle = 'red';
  // ctx.fillRect(-width / 2, -1, width, 2);
  // ctx.fillRect(-1, -height / 2, 2, height);

  // console.log(TriangularGrid.entries(state.grid));

  TriangularGrid.entries(state.grid).map(([coord, color]) => {
    Triangle({ coord, color });
  });
};

export default connect(Root);
