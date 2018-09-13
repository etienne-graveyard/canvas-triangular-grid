import { Renderable, connect } from '../types';

const Rectangle: Renderable = ({ ctx, width, height, state }) => {
  ctx.translate(10, 10);
  ctx.fillStyle = `rgba(0, 0, 0, 0.3)`;
  ctx.fillRect(0, 0, width - 20, height - 20);
};

export default connect(Rectangle);
