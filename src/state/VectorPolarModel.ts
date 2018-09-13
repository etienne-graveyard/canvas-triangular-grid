import VectorCartesianModel from './VectorCartesianModel';

namespace VectorPolarModel {
  export type State = {
    magnitude: number;
    direction: number;
  };

  export function create(magnitude: number, direction: number): State {
    return { magnitude, direction };
  }

  export function createFromCartesianValues(x: number, y: number): State {
    var x1 = x - 0.5;
    var y1 = y - 0.5;
    let dir = Math.atan(y1 / x1);
    if (x1 < 0) {
      dir += Math.PI;
    } else if (y1 < 0) {
      dir += Math.PI * 2;
    }
    return {
      magnitude: Math.sqrt(x1 * x1 + y1 * y1),
      direction: dir,
    };
  }

  export function createFromCartesianVector(vect: VectorCartesianModel.State): State {
    return createFromCartesianValues(vect.x, vect.y);
  }
}

export default VectorPolarModel;
