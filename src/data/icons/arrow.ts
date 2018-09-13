import TriangularGrid from '../../state/TriangularGrid';

const arrow: Array<TriangularGrid.Coordinate> = [
  { x: 1, y: 1, side: 'l' },
  { x: 1, y: 1, side: 'r' },
  { x: 0, y: 1, side: 'l' },
  { x: -1, y: 1, side: 'l' },
  { x: 0, y: 1, side: 'r' },
  { x: -2, y: 1, side: 'l' },
  { x: -1, y: 1, side: 'r' },
  { x: -3, y: 1, side: 'l' },
  { x: -2, y: 1, side: 'r' },
  { x: -3, y: 1, side: 'r' },
  { x: -4, y: 1, side: 'l' },
  { x: 1, y: 0, side: 'l' },
  { x: 1, y: 0, side: 'r' },
  { x: 1, y: -1, side: 'l' },
  { x: 1, y: -1, side: 'r' },
  { x: 1, y: -2, side: 'l' },
  { x: 1, y: -2, side: 'r' },
  { x: 1, y: -3, side: 'r' },
  { x: 1, y: -3, side: 'l' },
  { x: 1, y: -4, side: 'l' },
];

export default arrow;
