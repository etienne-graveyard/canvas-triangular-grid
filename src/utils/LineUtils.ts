namespace LineUtils {
  export type Line = (x: number) => number;
  export type Point = { x: number; y: number };

  export function lineFromPoint(p1: Point, p2: Point): Line {
    return (x: number) => {
      const size = p2.x - p1.x;
      const progress = (x - p1.x) / size;
      return p1.y + (p2.y - p1.y) * progress;
    };
  }
}

export default LineUtils;
