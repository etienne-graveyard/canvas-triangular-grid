type AnimatedModel = AnimatedModel.State;

namespace AnimatedModel {
  type StateStep = {
    delay: number;
    value: number;
  };

  export type State = Array<StateStep>;

  type Infos = { index: number; time: number; prevTime: number };

  function getInfos(state: State, t: number): Infos {
    return state.reduce<Infos>(
      (acc, v, index) => {
        const time = acc.prevTime + v.delay;
        if (time <= t) {
          return { index, time, prevTime: time };
        }
        acc.prevTime = time;
        return acc;
      },
      { index: -1, time: 0, prevTime: 0 }
    );
  }

  const test1: State = [{ delay: 0, value: 100 }];
  console.log(test1, 0, getInfos(test1, 0));
  console.log(test1, -100, getInfos(test1, -100));
  console.log(test1, 100, getInfos(test1, 100));

  /**
   * Create
   */

  export function createFromTo(t: number, from: number, to: number, delay: number, duration: number): State {
    return [{ delay: t + delay, value: from }, { delay: duration, value: to }];
  }

  export function createStatic(t: number, value: number): State {
    return [{ delay: t, value }];
  }

  /**
   * Mutate
   */

  function cleanup(model: State, t: number): void {
    const info = getInfos(model, t);
    // delete all passed steps
    if (info.index > 0) {
      model.splice(0, info.index);
      model[0].delay = info.time;
    }
  }

  function transitionTo(model: State, t: number, toValue: number, delay: number, duration: number): void {
    cleanup(model, t);
    const start = t + delay;
    const infoAtStart = getInfos(model, start);
    if (infoAtStart.index === model.length - 1) {
      // new annim is after => just push
      const last = model[model.length - 1];
      const delayAfterLast = start - infoAtStart.time;
      model.push({ delay: delayAfterLast, value: last.value }, { delay: duration, value: toValue });
      return;
    }
    const end = start + duration;
    const infoAtEnd = getInfos(model, end);
    const valueAtEnd = resolve(model, end);
    const valueAtStart = resolve(model, start);
    const stepsToRemove = infoAtEnd.index - infoAtStart.index + 1;
    const newDelayForBeforeStart = start - infoAtStart.time;
    const beforeEndIndex = infoAtEnd.index;
    const hasAfter = model[infoAtEnd.index + 1] !== undefined;

    const newSteps = [
      newDelayForBeforeStart > 0 ? { delay: newDelayForBeforeStart, value: valueAtStart } : null,
      { delay: duration, value: toValue },
    ].filter((v): v is StateStep => v !== null);

    model.splice(infoAtStart.index + 1, stepsToRemove, ...newSteps);

    // const newDelayForAfterEnd
  }

  export const mutate = {
    transitionTo,
    cleanup,
  };

  /**
   * Exports
   */

  export function resolve(model: State, t: number): number {
    if (model.length === 0) {
      throw new Error('Empty AnimatedModel');
    }
    if (model.length === 1) {
      return model[0].value;
    }
    const info = getInfos(model, t);
    if (info.index === -1) {
      // before first
      return model[0].value;
    }
    if (info.index === model.length - 1) {
      // after last
      return model[model.length - 1].value;
    }
    const before = model[info.index];
    const after = model[info.index + 1];
    const start = info.time;
    const duration = after.delay;
    const progress = (t - start) / duration;
    return before.value + (after.value - before.value) * progress;
  }
}

export default AnimatedModel;
