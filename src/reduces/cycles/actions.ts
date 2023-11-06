import { Cycle } from './reducer'

export enum ActionTypes {
  ADD_CYCLE = 'ADD-CYCLE',
  INTERRUPT_CYCLE = 'INTERRUPT_CYCLE',
  FINISH_CYCLE = 'FINISH_CYCLE',
}

export function addNewCycleAction(newCycle: Cycle) {
  return {
    type: ActionTypes.ADD_CYCLE,
    payload: {
      newCycle,
    },
  }
}

export function markCurrentCycleAsFinshedAction() {
  return {
    type: ActionTypes.FINISH_CYCLE,
  }
}
export function interruptCurrentCycleAsFinshedAction() {
  return {
    type: ActionTypes.INTERRUPT_CYCLE,
  }
}
