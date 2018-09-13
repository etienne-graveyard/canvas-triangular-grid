import TriangularGridUtils from '../utils/TriangularGridUtils';
import TransformUtils from '../utils/TransformUtils';
import { createEffect } from '../core';
import { TApp } from '../app';

const gridPrinter = TriangularGridUtils.create({ size: 6 });

const rightMargin = 10;

type Effects = {
  grid: TriangularGridUtils.Printer;
  transform: TransformUtils.Output;
};

const effects: Effects = {
  grid: gridPrinter,
  transform: createEffect((app: TApp) =>
    TransformUtils.create(
      {
        x: ({ width, height }) => width - height / 2 - rightMargin,
        y: ({ height }) => height / 2,
      },
      app
    )
  ),
};

export default effects;
