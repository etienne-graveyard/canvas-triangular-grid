const range = (n: number): Array<number> => Array.apply(null, { length: n }).map(Number.call, Number);

export default range;
