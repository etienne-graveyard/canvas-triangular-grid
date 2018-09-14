type DldcMap<K, V> = DldcMap.State<K, V>;

namespace DldcMap {
  export type State<K, V> = {
    keys: Array<K>;
    values: Array<V>;
  };

  export function create<K, V>(): State<K, V> {
    return {
      keys: [],
      values: [],
    };
  }

  export function set<K, V>(model: State<K, V>, key: K, value: V): void {
    const index = model.keys.indexOf(key);
    if (index === -1) {
      model.keys.push(key);
      model.values.push(value);
    } else {
      model.values[index] = value;
    }
  }

  export function update<K, V>(model: State<K, V>, key: K, updater: (value: V) => V, notSetValue: V): void {
    const index = model.keys.indexOf(key);
    if (index === -1) {
      model.keys.push(key);
      model.values.push(updater(notSetValue));
    } else {
      model.values[index] = updater(model.values[index]);
    }
  }

  export function updateIfExist<K, V>(model: State<K, V>, key: K, updater: (value: V) => V): void {
    const index = model.keys.indexOf(key);
    if (index > -1) {
      model.values[index] = updater(model.values[index]);
    }
  }

  export function remove<K, V>(model: State<K, V>, key: K): void {
    const index = model.keys.indexOf(key);
    if (index > -1) {
      model.values.splice(index, 1);
      model.keys.splice(index, 1);
    }
  }

  export function get<K, V>(model: State<K, V>, key: K, notSetValue: V): V {
    const index = model.keys.indexOf(key);
    if (index === -1) {
      return notSetValue;
    }
    return model.values[index];
  }

  export function getOrThrow<K, V>(model: State<K, V>, key: K): V {
    const index = model.keys.indexOf(key);
    if (index === -1) {
      throw new Error(`Can't find key in DldcMap`);
    }
    return model.values[index];
  }

  export function has<K, V>(model: State<K, V>, key: K): boolean {
    const index = model.keys.indexOf(key);
    if (index === -1) {
      return false;
    }
    return true;
  }

  export function forEach<K, V>(model: State<K, V>, sideEffect: (value: V, key: K, iter: State<K, V>) => void): void {
    model.keys.forEach((key, index) => sideEffect(model.values[index], key, model));
  }

  export function map<K, V>(model: State<K, V>, mapper: (value: V, key: K, iter: State<K, V>) => V): void {
    model.values = model.keys.map((key, index) => mapper(model.values[index], key, model));
  }

  export function values<K, V>(model: State<K, V>): Array<V> {
    return model.values;
  }

  export function keys<K, V>(model: State<K, V>): Array<K> {
    return model.keys;
  }

  export function entries<K, V>(model: State<K, V>): Array<[K, V]> {
    return model.keys.map((key, index) => [key, model.values[index]] as any);
  }

  export function size<K, V>(model: State<K, V>): number {
    return model.values.length;
  }
}

export default DldcMap;
