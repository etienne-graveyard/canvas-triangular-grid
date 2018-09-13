import App from './core';
import state from './state';
import { theWidth, theHeight, density } from './config';
import effects from './effects';

const app = new App({
  state,
  width: theWidth,
  height: theHeight,
  density,
  effects,
});

(window as any).app = app;

export default app;
