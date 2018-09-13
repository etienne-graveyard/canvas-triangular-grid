import TriangularGrid from './TriangularGrid';

type State = {
  grid: TriangularGrid.State<boolean>;
};

const state: State = {
  grid: TriangularGrid.create(),
};

export default state;
