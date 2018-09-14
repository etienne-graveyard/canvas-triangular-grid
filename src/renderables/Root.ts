import { Renderable, connect } from '../types';
import TriangularGrid from '../state/TriangularGrid';
import Triangle from './Triangle';

const Root: Renderable = ({ ctx, width, height, state, grid, t, transform }) => {
  ctx.fillStyle = `white`;
  ctx.fillRect(0, 0, width, height);

  transform.apply();

  TriangularGrid.entries(state.grid).map(([coord, color]) => {
    Triangle({ coord, color });
  });
};

export default connect(Root);
