import { Renderable, connect } from '../types';
import TriangularGrid from '../state/TriangularGrid';
import Triangle from './Triangle';

const Root: Renderable = ({ ctx, width, height, state, grid, t, transform }) => {
  ctx.fillStyle = `white`;
  ctx.fillRect(0, 0, width, height);

  transform.apply();

  const topleft = transform.reverse(0, height);
  if (t === 0) {
    console.log(topleft);
  }

  ctx.fillStyle = 'red';
  ctx.fillRect(topleft.x - 10, topleft.y - 10, 20, 20);

  TriangularGrid.entries(state.grid).map(([coord, color]) => {
    Triangle({ coord, color });
  });
};

export default connect(Root);
