namespace ColorRgbaModel {
  export type State = { red: number; green: number; blue: number; alpha: number };

  export function create(red: number, green: number, blue: number, alpha: number): State {
    return { red, green, blue, alpha };
  }

  export function toString(color: State): string {
    return `rgba(${color.red},${color.green},${color.blue},${color.alpha})`;
  }
}

export default ColorRgbaModel;
