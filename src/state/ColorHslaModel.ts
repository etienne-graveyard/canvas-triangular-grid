import AnimatedModel from './AnimatedModel';

type ColorHlsaModel = ColorHlsaModel.State;

namespace ColorHlsaModel {
  export type State = {
    hue: AnimatedModel;
    saturation: AnimatedModel;
    lightness: AnimatedModel;
    alpha: AnimatedModel;
  };

  type StateResolved = {
    hue: number;
    saturation: number;
    lightness: number;
    alpha: number;
  };

  export function create(
    hue: AnimatedModel,
    saturation: AnimatedModel,
    lightness: AnimatedModel,
    alpha: AnimatedModel
  ): State {
    return { hue, saturation, lightness, alpha };
  }

  export function createResolved(
    hue: number,
    saturation: number,
    lightness: number,
    alpha: number = 1
  ): StateResolved {
    return { hue, saturation, lightness, alpha };
  }

  export function createFromTo(from: StateResolved, to: StateResolved, start: number, duration: number): State {
    return {
      hue: AnimatedModel.create(from.hue, to.hue, start, duration),
      saturation: AnimatedModel.create(from.saturation, to.saturation, start, duration),,
      lightness: AnimatedModel.create(from.lightness, to.lightness, start, duration),,
      alpha: AnimatedModel.create(from.alpha, to.alpha, start, duration),,
    };
  }

  export function transitionFrom(current: State, t: number, to: StateResolved, start: number, duration: number) {
    const resoled = resolve(current, t);
    return createFromTo(
      resoled,
      to,
      start,
      duration
    )
  }

  export function resolve(model: State, t: number): StateResolved {
    return {
      hue: AnimatedModel.resolve(model.hue, t),
      saturation: AnimatedModel.resolve(model.saturation, t),
      lightness: AnimatedModel.resolve(model.lightness, t),
      alpha: AnimatedModel.resolve(model.alpha, t),
    };
  }

  // hsla(255, 100%, 50%, 0.5)
  export function toString(color: State, t: number): string {
    const resolved = resolve(color, t);
    return `hsla(${resolved.hue},${resolved.saturation}%,${resolved.lightness}%,${resolved.alpha})`;
  }
}

export default ColorHlsaModel;
