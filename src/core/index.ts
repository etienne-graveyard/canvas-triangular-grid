import { timeSinceLastFrame, currentFrameTime, onFrameStart, onFrameEnd } from 'framesync';
// import ProxyStateTree from 'proxy-state-tree';
import { createCanvas, setupCanvas } from './createCanvas';

type MutationEffects = {
  dt: number;
  t: number;
  width: number;
  height: number;
};

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

class App<State extends object, UserEffects extends object> {
  private canvasEl: HTMLCanvasElement;
  private mounted: boolean = false;
  private ctx: CanvasRenderingContext2D;
  // private tree: ProxyStateTree;
  private width: number;
  private height: number;
  private density: number = 1;
  private eventsListeners: Map<keyof HTMLElementEventMap, Array<any>> = new Map();
  private userEffects: UserEffects;
  private state: State;

  constructor(options: Options<State, UserEffects>) {
    const { density = 1, width, height, state, effects } = options;
    this.userEffects = effects;
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
    // this.tree = new ProxyStateTree(state);
    this.renderSub = this.renderSub.bind(this);
    this.connect = this.connect.bind(this);
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
    this.ctx.save();
    // this.ctx.scale(0.5, 0.5);
    this.renderSub(rootRenderable, {});
    this.ctx.restore();
  }

  getImageData(sx: number = 0, sy: number = 0, sw?: number, sh?: number): ImageData {
    let w = sw === undefined ? this.width : sw;
    let h = sh === undefined ? this.width : sh;
    return this.ctx.getImageData(
      sx, // Math.floor(sx / this.density),
      sy, // Math.floor(sy / this.density),
      w, // Math.floor((sw === undefined ? this.width : sw) / this.density),
      h // Math.floor((sh === undefined ? this.height : sh) / this.density)
    );
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

  // mutate(mutation: (state: State, context: MutationEffects) => void): void {
  //   this.tree.startMutationTracking();
  //   mutation(this.tree.get(), {
  //     dt: timeSinceLastFrame(),
  //     t: currentFrameTime(),
  //     width: this.width,
  //     height: this.height,
  //   });
  //   this.tree.clearMutationTracking();
  //   onFrameEnd(() => {
  //     this.tree.flush();
  //   });
  // }

  mutate(mutation: (state: State, context: MutationEffects) => void): void {
    mutation(this.state, {
      dt: timeSinceLastFrame(),
      t: currentFrameTime(),
      width: this.width,
      height: this.height,
    });
    // this.tree.clearMutationTracking();
    // onFrameEnd(() => {
    //   this.tree.flush();
    // });
  }

  // getState(): State {
  //   return this.tree.get();
  // }

  getState(): State {
    return this.state;
  }

  connect<Props extends object, Output = void>(
    renderable: IRenderable<State, UserEffects, Props, Output>
  ): (props: Props) => Output {
    return props => this.renderSub(renderable, props);
  }

  private getEffects<Props extends object = {}>(props: Props): Effects<State, UserEffects, Props> {
    const coreEffects: CoreEffects<State, UserEffects> = {
      dt: timeSinceLastFrame(),
      t: currentFrameTime(),
      width: this.width,
      height: this.height,
      ctx: this.ctx,
      render: this.renderSub,
      state: this.state, // this.tree.get(),
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
    this.ctx.save();
    const result = renderable(this.getEffects(props));
    this.ctx.restore();
    return result;
  }

  private applySize() {
    this.canvasEl.height = this.height / this.density;
    this.canvasEl.width = this.width / this.density;
  }
}

export default App;
