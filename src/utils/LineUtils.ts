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

  export function distance(p1: Point, p2: Point): number {
    const dx = Math.abs(p2.x - p1.x);
    const dy = Math.abs(p2.y - p1.y);
    return Math.sqrt(dx * dx + dy * dy);
  }

  export function deltas(p1: Point, p2: Point): Point {
    const dx = Math.abs(p2.x - p1.x);
    const dy = Math.abs(p2.y - p1.y);
    return { x: dx, y: dy };
  }

  export function deltasSum(p1: Point, p2: Point): number {
    const dx = Math.abs(p2.x - p1.x);
    const dy = Math.abs(p2.y - p1.y);
    return dx + dy;
  }
}

export default LineUtils;
