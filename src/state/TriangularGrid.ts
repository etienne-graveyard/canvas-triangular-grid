import DldcMap from './DldcMap';

type TriangularGrid<V> = TriangularGrid.State<V>;

namespace TriangularGrid {
  const privateSymbol = Symbol();

  type OfuscatedKey = {
    __private: typeof privateSymbol;
  };

  export type State<V> = DldcMap.State<OfuscatedKey, V>;

  export type Coordinate = {
    x: number;
    y: number;
    side: 'l' | 'r';
  };

  export function create<V>(): State<V> {
    return DldcMap.create<OfuscatedKey, V>();
  }

  function serializeCoord(coord: Coordinate): OfuscatedKey {
    return `${Math.floor(coord.x)}_${Math.floor(coord.y)}_${coord.side}` as any;
  }

  function deserializeCoord(coord: OfuscatedKey): Coordinate {
    const parts = ((coord as any) as string).split('_');
    return {
      x: parseInt(parts[0], 10),
      y: parseInt(parts[1], 10),
      side: parts[2] as any,
    };
  }

  export function set<V>(model: State<V>, coord: Coordinate, value: V): void {
    DldcMap.set(model, serializeCoord(coord), value);
  }

  export function has<V>(model: State<V>, coord: Coordinate): boolean {
    return DldcMap.has(model, serializeCoord(coord));
  }

  export function remove<V>(model: State<V>, coord: Coordinate): void {
    return DldcMap.remove(model, serializeCoord(coord));
  }

  export function updateIfExist<V>(model: State<V>, coord: Coordinate, updater: (value: V) => V): void {
    return DldcMap.updateIfExist(model, serializeCoord(coord), updater);
  }

  export function update<V>(model: State<V>, coord: Coordinate, updater: (value: V) => V, notSetValue: V): void {
    return DldcMap.update(model, serializeCoord(coord), updater, notSetValue);
  }

  export function get<V>(model: State<V>, coord: Coordinate): V {
    return DldcMap.getOrThrow(model, serializeCoord(coord));
  }

  export function entries<V>(model: State<V>): Array<[Coordinate, V]> {
    return DldcMap.entries(model).map(entry => [deserializeCoord(entry[0]), entry[1]] as any);
  }
}

export default TriangularGrid;
