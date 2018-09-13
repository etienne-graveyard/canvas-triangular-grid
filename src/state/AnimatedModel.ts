type AnimatedModel = AnimatedModel.State;

namespace AnimatedModel {
  export type State =
    | number
    | {
        from: number;
        to: number;
        start: number;
        duration: number;
      };

  export function create(from: number, to: number, start: number, duration: number): State {
    return {
      from,
      to,
      start,
      duration,
    };
  }

  export function resolve(state: State, t: number): number {
    if (typeof state === 'number') {
      return state;
    }
    if (t <= state.start) {
      return state.from;
    }
    if (t >= state.start + state.duration) {
      return state.to;
    }
    const progress = (t - state.start) / state.duration;
    return state.from + (state.to - state.from) * progress;
  }
}

export default AnimatedModel;
