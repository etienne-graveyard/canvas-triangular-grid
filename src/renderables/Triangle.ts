import { Renderable, connect } from '../types';

export type Props = {};

const Triangle: Renderable<Props> = ({ ctx, width, height, state }) => {
  ctx.beginPath();
  const size = 20;
  const h = size * (Math.sqrt(3) / 2);
  ctx.fillStyle = 'red';
  ctx.moveTo(0, 0);
  ctx.lineTo(0, size);
  ctx.lineTo(h, size / 2);
  ctx.closePath();
  ctx.fill();
};

export default connect(Triangle);
