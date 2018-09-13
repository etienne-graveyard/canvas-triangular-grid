const range = (n: number, end?: number): Array<number> => {
  const theStart = end === undefined ? 0 : n;
  const theEnd = end === undefined ? n : end;
  const size = theEnd - theStart;
  return Array.apply(null, { length: size })
    .map(Number.call, Number)
    .map((v: number) => theStart + v);
};

export default range;
