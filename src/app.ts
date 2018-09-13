import App from './core';
import state from './state';
import { theWidth, theHeight } from './config';
import effects from './effects';

const canvasEl = document.getElementById('search-canvas');

const app = new App({
  state,
  width: theWidth,
  height: theHeight,
  effects,
  canvas: canvasEl as any,
});

export type TApp = typeof app;

(window as any).app = app;

export default app;
