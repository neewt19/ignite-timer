import {
  ReactNode,
  createContext,
  useEffect,
  useReducer,
  useState,
} from 'react'
import { Cycle, cyclesReduce } from '../reduces/cycles/reducer'
import {
  addNewCycleAction,
  interruptCurrentCycleAsFinshedAction,
  markCurrentCycleAsFinshedAction,
} from '../reduces/cycles/actions'

interface CreateCycleData {
  task: string
  minutesAmount: number
}

interface CyclesContexType {
  cycles: Cycle[]
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  amountSecondsPassed: number
  markCurrentCycleAsFinished: () => void
  setSecondsPassed: (seconds: number) => void
  createNewCycle: (data: CreateCycleData) => void
  interruptCurrentCycle: () => void
}

export const CycleContext = createContext({} as CyclesContexType)

interface CycleContextProviderProps {
  children: ReactNode
}

// const reducer = (state, action) => {
//   switch (action.type) {
//     case 'SET_VARIAVEL':
//       return { ...state, : action.payload }
//     default:
//       return state
//   }
// }

export function CycleContextProvider({ children }: CycleContextProviderProps) {
  const [cyclesState, dispatch] = useReducer(cyclesReduce, {
    cycles: [],
    activeCycleId: null,
  })

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  useEffect(() => {
    const stateJSON = JSON.stringify(cyclesState)

    localStorage.setItem('@ignite-timer:cycles-state-1.0.0', stateJSON)
  }, [cyclesState])

  useEffect(() => {
    localStorage.getItem('@ignite-timer:cycles-state-1.0.0')
  }, [])

  const { cycles, activeCycleId } = cyclesState
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)
  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  function createNewCycle(data: CreateCycleData) {
    const id = String(new Date().getTime())

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    dispatch(addNewCycleAction(newCycle))
    setAmountSecondsPassed(0)

    // reset()
  }
  function interruptCurrentCycle() {
    dispatch(interruptCurrentCycleAsFinshedAction())
  }

  function markCurrentCycleAsFinished() {
    dispatch(markCurrentCycleAsFinshedAction())
    /*     setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, finishedDate: new Date() }
        } else {
          return cycle
        }
      }),
    ) */
  }

  return (
    <CycleContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        markCurrentCycleAsFinished,
        amountSecondsPassed,
        setSecondsPassed,
        createNewCycle,
        interruptCurrentCycle,
      }}
    >
      {children}
    </CycleContext.Provider>
  )
}
