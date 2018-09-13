import TriangularGrid from './TriangularGrid';
import ColorHlsaModel from './ColorHslaModel';

type State = {
  grid: TriangularGrid.State<ColorHlsaModel>;
};

const state: State = {
  grid: TriangularGrid.create(),
};

export default state;
