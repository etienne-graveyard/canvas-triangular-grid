import { timeSinceLastFrame, currentFrameTime, onFrameStart, onFrameEnd } from 'framesync';
import { createCanvas, setupCanvas } from './createCanvas';

type CoreEffects<State extends object, UserEffects extends object> = {
  dt: number;
  t: number;
  width: number;
  height: number;
  ctx: CanvasRenderingContext2D;
  render: <Props extends object, Output = void>(
    renderable: IRenderable<State, UserEffects, Props, Output>,
    props: Props
  ) => Output;
  app: App<State, UserEffects>;
  state: State;
};

type Effects<State extends object, UserEffects extends object, Props extends object = {}> = Props &
  UserEffects &
  CoreEffects<State, UserEffects>;

export type IRenderable<State extends object, UserEffects extends object, Props extends object = {}, Output = void> = (
  props: Effects<State, UserEffects, Props>
) => Output;

type Options<State extends object, UserEffects extends object> = {
  state: State;
  width: number;
  height: number;
  density?: number;
  effects: UserEffects;
  canvas?: HTMLCanvasElement;
};

export function createEffect<TApp extends App<object, object>, T>(effectCreator: (app: TApp) => T): T {
  return effectCreator as any;
}

class App<State extends object, UserEffects extends object> {
  private canvasEl: HTMLCanvasElement;
  private mounted: boolean = false;
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;
  private density: number = 1;
  private eventsListeners: Map<keyof HTMLElementEventMap, Array<any>> = new Map();
  private userEffects: UserEffects;
  private state: State;
  private onFrameStartListeners: Array<(effects: Effects<State, UserEffects>) => void> = [];

  constructor(options: Options<State, UserEffects>) {
    const { density = 1, width, height, state, effects } = options;
    this.userEffects = Object.keys(effects).reduce<typeof effects>(
      (acc, key) => {
        const effect = effects[key];
        if (typeof effect === 'function') {
          acc[key] = effect(this);
        } else {
          acc[key] = effect;
        }
        return acc;
      },
      {} as any
    );
    const { el, ctx } = options.canvas
      ? setupCanvas(options.canvas, width, height, density)
      : createCanvas(width, height, density);
    this.mounted = options.canvas !== undefined;
    this.canvasEl = el;
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.density = density;
    this.applySize();
    this.state = state;
    this.renderSub = this.renderSub.bind(this);
    this.connect = this.connect.bind(this);
  }

  onFrameStart(cb: (effects: Effects<State, UserEffects>) => void): void {
    this.onFrameStartListeners.push(cb);
  }

  mountOnBody() {
    if (this.mounted) {
      console.warn('Already mounted');
      return;
    }
    document.body.appendChild(this.canvasEl);
  }

  destroy() {
    if (this.canvasEl.parentNode) {
      this.canvasEl.parentNode.removeChild(this.canvasEl);
    }
  }

  resize(width: number, height: number) {
    onFrameEnd(() => {
      this.width = width;
      this.height = height;
      this.applySize();
    });
  }

  render(rootRenderable: IRenderable<State, {}>) {
    const loop = () => {
      this.renderOnce(rootRenderable);
      onFrameStart(loop);
    };
    loop();
  }

  renderOnce(rootRenderable: IRenderable<State, {}>) {
    this.onFrameStartListeners.forEach(listener => {
      listener(this.getEffects({}));
    });
    this.ctx.save();
    this.renderSub(rootRenderable, {});
    this.ctx.restore();
  }

  getImageData(sx: number = 0, sy: number = 0, sw?: number, sh?: number): ImageData {
    let w = sw === undefined ? this.width : sw;
    let h = sh === undefined ? this.width : sh;
    return this.ctx.getImageData(sx, sy, w, h);
  }

  addEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (ev: HTMLElementEventMap[K], effects: Effects<State, UserEffects>) => any,
    options?: AddEventListenerOptions
  ): void {
    const wrappedListener = (ev: HTMLElementEventMap[K]) => listener(ev, this.getEffects({}));
    if (!this.eventsListeners.has(type)) {
      this.eventsListeners.set(type, [wrappedListener]);
    } else {
      const arr = this.eventsListeners.get(type);
      if (!arr) {
        throw new Error('What ?');
      }
      arr.push(wrappedListener);
    }
    return this.canvasEl.addEventListener(type, wrappedListener, options);
  }

  mutate(mutation: (state: State, context: Effects<State, UserEffects, {}>) => void): void {
    mutation(this.state, this.getEffects({}));
  }

  getState(): State {
    return this.state;
  }

  connect<Props extends object, Output = void>(
    renderable: IRenderable<State, UserEffects, Props, Output>
  ): {} extends Props ? (() => Output) : ((props: Props) => Output) {
    return ((props: Props) => this.renderSub(renderable, props)) as any;
  }

  private getEffects<Props extends object = {}>(props: Props): Effects<State, UserEffects, Props> {
    const coreEffects: CoreEffects<State, UserEffects> = {
      dt: timeSinceLastFrame(),
      t: currentFrameTime(),
      width: this.width,
      height: this.height,
      ctx: this.ctx,
      render: this.renderSub,
      state: this.state,
      app: this,
    };
    return {
      ...(props as any),
      ...(this.userEffects as any),
      ...coreEffects,
    };
  }

  private renderSub<Props extends object, Output = void>(
    renderable: IRenderable<State, UserEffects, Props, Output>,
    props: Props
  ): Output {
    const result = renderable(this.getEffects(props));
    return result;
  }

  private applySize() {
    this.canvasEl.height = this.height / this.density;
    this.canvasEl.width = this.width / this.density;
  }
}

export default App;
