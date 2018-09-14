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

  function serializeKey(coord: Coordinate): OfuscatedKey {
    return `${Math.floor(coord.x)}_${Math.floor(coord.y)}_${coord.side}` as any;
  }

  function deserializeKey(coord: OfuscatedKey): Coordinate {
    const parts = ((coord as any) as string).split('_');
    return {
      x: parseInt(parts[0], 10),
      y: parseInt(parts[1], 10),
      side: parts[2] as any,
    };
  }

  export function serializeCoord(coord: Coordinate): string {
    return `${Math.floor(coord.x)}_${Math.floor(coord.y)}_${coord.side}`;
  }

  export function deserializeCoord(coord: string): Coordinate {
    const parts = ((coord as any) as string).split('_');
    return {
      x: parseInt(parts[0], 10),
      y: parseInt(parts[1], 10),
      side: parts[2] as any,
    };
  }

  export function set<V>(model: State<V>, coord: Coordinate, value: V): void {
    DldcMap.set(model, serializeKey(coord), value);
  }

  export function has<V>(model: State<V>, coord: Coordinate): boolean {
    return DldcMap.has(model, serializeKey(coord));
  }

  export function remove<V>(model: State<V>, coord: Coordinate): void {
    return DldcMap.remove(model, serializeKey(coord));
  }

  export function updateIfExist<V>(model: State<V>, coord: Coordinate, updater: (value: V) => V): void {
    return DldcMap.updateIfExist(model, serializeKey(coord), updater);
  }

  export function update<V>(model: State<V>, coord: Coordinate, updater: (value: V) => V, notSetValue: V): void {
    return DldcMap.update(model, serializeKey(coord), updater, notSetValue);
  }

  export function get<V>(model: State<V>, coord: Coordinate): V {
    return DldcMap.getOrThrow(model, serializeKey(coord));
  }

  export function entries<V>(model: State<V>): Array<[Coordinate, V]> {
    return DldcMap.entries(model).map(entry => [deserializeKey(entry[0]), entry[1]] as any);
  }

  export function keys<V>(model: State<V>): Array<Coordinate> {
    return DldcMap.keys(model).map(key => deserializeKey(key));
  }
}

export default TriangularGrid;
