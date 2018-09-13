import AnimatedModel from './AnimatedModel';

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
