import DldcMap from './DldcMap';

type TriangularGrid<V> = TriangularGrid.State<V>;

namespace TriangularGrid {
  const privateSymbol = Symbol();

  type OfuscatedKey = {
    __private: typeof privateSymbol;
  };

  export type State<V> = DldcMap.State<OfuscatedKey, V>;

  export type TriangularCoordinate = {
    x: number;
    y: number;
    side: 'l' | 'r';
  };

  export function create<V>(): State<V> {
    return DldcMap.create<OfuscatedKey, V>();
  }

  function serializeCoord(coord: TriangularCoordinate): OfuscatedKey {
    return `${Math.floor(coord.x)}_${Math.floor(coord.y)}_${coord.side}` as any;
  }

  function deserializeCoord(coord: OfuscatedKey): TriangularCoordinate {
    const parts = ((coord as any) as string).split('_');
    return {
      x: parseInt(parts[0], 10),
      y: parseInt(parts[1], 10),
      side: parts[2] as any,
    };
  }

  export function set<V>(model: State<V>, coord: TriangularCoordinate, value: V): void {
    DldcMap.set(model, serializeCoord(coord), value);
  }

  export function has<V>(model: State<V>, coord: TriangularCoordinate): boolean {
    return DldcMap.has(model, serializeCoord(coord));
  }

  export function remove<V>(model: State<V>, coord: TriangularCoordinate): void {
    return DldcMap.remove(model, serializeCoord(coord));
  }

  export function updateIfExist<V>(model: State<V>, coord: TriangularCoordinate, updater: (value: V) => V): void {
    return DldcMap.updateIfExist(model, serializeCoord(coord), updater);
  }

  export function get<V>(model: State<V>, coord: TriangularCoordinate): V {
    return DldcMap.getOrThrow(model, serializeCoord(coord));
  }

  export function entries<V>(model: State<V>): Array<[TriangularCoordinate, V]> {
    return DldcMap.entries(model).map(entry => [deserializeCoord(entry[0]), entry[1]] as any);
  }
}

export default TriangularGrid;
