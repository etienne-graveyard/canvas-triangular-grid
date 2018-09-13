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

  export function createResolved(hue: number, saturation: number, lightness: number, alpha: number = 1): StateResolved {
    return { hue, saturation, lightness, alpha };
  }

  export function createFromTo(
    t: number,
    from: StateResolved,
    to: StateResolved,
    start: number,
    duration: number
  ): State {
    return {
      hue: AnimatedModel.createFromTo(t, from.hue, to.hue, start, duration),
      saturation: AnimatedModel.createFromTo(t, from.saturation, to.saturation, start, duration),
      lightness: AnimatedModel.createFromTo(t, from.lightness, to.lightness, start, duration),
      alpha: AnimatedModel.createFromTo(t, from.alpha, to.alpha, start, duration),
    };
  }

  export function createStatic(t: number, from: StateResolved): State {
    return {
      hue: AnimatedModel.createStatic(t, from.hue),
      saturation: AnimatedModel.createStatic(t, from.saturation),
      lightness: AnimatedModel.createStatic(t, from.lightness),
      alpha: AnimatedModel.createStatic(t, from.alpha),
    };
  }

  export function transitionTo(current: State, t: number, to: StateResolved, delay: number, duration: number): State {
    AnimatedModel.transitionTo(current.hue, t, to.hue, delay, duration);
    AnimatedModel.transitionTo(current.saturation, t, to.saturation, delay, duration);
    AnimatedModel.transitionTo(current.lightness, t, to.lightness, delay, duration);
    AnimatedModel.transitionTo(current.alpha, t, to.alpha, delay, duration);
    return current;
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
