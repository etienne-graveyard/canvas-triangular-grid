namespace VectorCartesianModel {
  export type State = {
    x: number;
    y: number;
  };

  export function create(x: number, y: number): State {
    return { x, y };
  }

  export function createFromPolarValues(magnitude: number, direction: number): State {
    return {
      x: 0.5 + magnitude * Math.cos(direction),
      y: 0.5 + magnitude * Math.sin(direction),
    };
  }
}

export default VectorCartesianModel;
