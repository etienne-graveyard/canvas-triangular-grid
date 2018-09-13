import TriangularGrid from '../state/TriangularGrid';

type TriangularGridUtil = TriangularGridUtil.Printer;

namespace TriangularGridUtil {
  type Options = {
    size: number;
  };

  type Coord = { x: number; y: number };
  type CoordFour = {
    xrgh: Coord;
    xbtm: Coord;
    xlft: Coord;
    xtop: Coord;
  };

  export type Printer = {
    resolve(coord: TriangularGrid.TriangularCoordinate): Coord;
    resolveFour(coord: TriangularGrid.TriangularCoordinate): CoordFour;
    antiResolve(x: number, y: number): TriangularGrid.TriangularCoordinate;
  };

  export function create(options: Options): Printer {
    const { size } = options;

    // transform params
    const trAngle = -Math.PI / 4;
    const trScaleX = Math.sqrt(3) / Math.sqrt(2);
    const trScaleY = 1 / Math.sqrt(2);
    const trMoveX = -(size * Math.sqrt(3)) / 2;

    const rotateVector = (angle: number) => (xy: [number, number]): [number, number] => [
      xy[0] * Math.cos(angle) - xy[1] * Math.sin(angle),
      xy[0] * Math.sin(angle) + xy[1] * Math.cos(angle),
    ];
    const scaleVector = (scaleX: number = 0, scaleY: number = 0) => (xy: [number, number]): [number, number] => [
      xy[0] * scaleX,
      xy[1] * scaleY,
    ];
    const moveVector = (moveX: number = 0, moveY: number = 0) => (xy: [number, number]): [number, number] => [
      xy[0] + moveX,
      xy[1] + moveY,
    ];

    function transform(x: number, y: number): [number, number] {
      return moveVector(trMoveX)(scaleVector(trScaleX, trScaleY)(rotateVector(trAngle)([x, y])));
    }

    function antiTransform(x: number, y: number): [number, number] {
      return rotateVector(-trAngle)(scaleVector(1 / trScaleX, 1 / trScaleY)(moveVector(-trMoveX)([x, y])));
    }

    function toObj(val: [number, number]): { x: number; y: number } {
      return { x: val[0], y: val[1] };
    }

    return {
      resolveFour: coord => {
        const xrgh = toObj(transform(coord.x * size, coord.y * size));
        const xbtm = toObj(transform((coord.x + 1) * size, coord.y * size));
        const xlft = toObj(transform((coord.x + 1) * size, (coord.y + 1) * size));
        const xtop = toObj(transform(coord.x * size, (coord.y + 1) * size));
        return {
          xrgh,
          xbtm,
          xlft,
          xtop,
        };
      },
      resolve: (coord: TriangularGrid.TriangularCoordinate) => {
        return toObj(transform(coord.x * size, coord.y * size));
      },
      antiResolve: (xVal, yVal) => {
        const [x, y] = antiTransform(xVal, yVal);
        const gridXProgress = x / size;
        const gridYProgress = y / size;
        const gridX = Math.floor(gridXProgress);
        const gridY = Math.floor(gridYProgress);
        const p1 = { x: gridX + 1, y: gridY };
        const p2 = { x: gridX, y: gridY + 1 };
        const line = (x: number) => {
          const size = p2.x - p1.x;
          const progress = (x - p1.x) / size;
          return p1.y + (p2.y - p1.y) * progress;
        };
        const isLeft = gridYProgress > line(gridXProgress);
        return { x: gridX, y: gridY, side: isLeft ? 'l' : 'r' };
      },
    };
  }

  export function move(
    coord: TriangularGrid.TriangularCoordinate,
    xMove: number,
    yMove: number = 0
  ): TriangularGrid.TriangularCoordinate {
    return {
      side: coord.side,
      x: coord.x + xMove + yMove,
      y: coord.y + xMove - yMove,
    };
  }

  export function moveAll(
    coords: Array<TriangularGrid.TriangularCoordinate>,
    xMove: number,
    yMove: number = 0
  ): Array<TriangularGrid.TriangularCoordinate> {
    return coords.map(c => move(c, xMove, yMove));
  }
}

export default TriangularGridUtil;
