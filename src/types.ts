import { IRenderable } from './core';
import app from './app';
import state from './state';
import effects from './effects';

export type Renderable<Props extends object = {}, Output = void> = IRenderable<
  typeof state,
  typeof effects,
  Props,
  Output
>;

export const connect = app.connect;
