import { HandPalm, Play } from 'phosphor-react'
import * as S from './styles'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { useEffect, useState } from 'react'
import { differenceInSeconds } from 'date-fns'

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod
    .number()
    .min(1, 'tem que ser no minimo 5 min man')
    .max(60, 'tem que ter no maximo 60 min man'),
})

// interface NewCycleFormData {
//   task: string
//   minutesAmount: number
// }

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?:Date
  finishedDate?:Date
}

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })

  const id = String(new Date().getTime())
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)


  useEffect(() => {
    let interval: number
    if (activeCycle) {
      interval = setInterval(() => {
        const secondsDiference = differenceInSeconds(
          new Date(),
          activeCycle.startDate
        )
        
        if (secondsDiference >= totalSeconds){
          setCycles(state => state.map(cycle => {
              if (cycle.id === activeCycleId){
                return {...cycle, finishedDate: new Date( )}
              }else{
                return cycle
              }
            })
          )

          setAmountSecondsPassed(totalSeconds)
          clearInterval(interval)
        }

        else{
          setAmountSecondsPassed(secondsDiference)
        }

      }, 100)
    }


    return ()=>{
      clearInterval(interval)
    }
  }, [activeCycle])

  function handleCreateNewCycle(data: NewCycleFormData) {
    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    setCycles((state) => [...state, newCycle])
    setActiveCycleId(newCycle.id)

    reset()
  }

  function handleInterruptCycle(){
    setCycles(state => state.map(cycle =>{
      if (cycle.id === activeCycleId){
        return {...cycle, interruptedDate: new Date( )}
      }else{
        return cycle
      }
    }))
    setActiveCycleId(null)
  }

  console.log(cycles)
  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0
  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0

  const minutesAmount = Math.floor(currentSeconds / 60)
  const secondsAmount = currentSeconds % 60

  const minutes = String(minutesAmount).padStart(2, '0')
  const seconds = String(secondsAmount).padStart(2, '0')

  const task = watch('task')

  const isSubmitDesabled = !task
  useEffect(()=>{
    if(activeCycle){
      document.title = `${minutes}:${seconds}`
    }else{
      document.title = document.title
    }
  },[minutes,seconds])

  return (
    <S.HomeContainer>
      <form action="" onSubmit={handleSubmit(handleCreateNewCycle)}>
        <S.FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <S.TaskInput
            id="task"
            list="Task-sugestion"
            disabled={!!activeCycle}
            placeholder="Dê um nome para o seu projeto"
            {...register('task')}
            />

          <datalist id="Task-sugestion">
            <option value="projeto 1"></option>
            <option value="projeto 2"></option>
            <option value="projeto 3"></option>
            <option value="Futebol"></option>
          </datalist>

          <label htmlFor="mutesAmount">durante</label>
          <S.MinutesAmountInput
            type="number"
            id="minutesAmount"
            placeholder="00"
            step={5}
            min={1}
            max={60}
            disabled={!!activeCycle}
            {...register('minutesAmount', { valueAsNumber: true })}
            />

          <span>minutos.</span>
        </S.FormContainer>

        <S.CountdownContainer>
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>
          <S.Separator>:</S.Separator>
          <span>{seconds[0]}</span>
          <span>{seconds[1]}</span>
        </S.CountdownContainer>
        {activeCycle?(
          <S.StopCountDownButton type="button" onClick={handleInterruptCycle}>
            <HandPalm/>
            Interromper
          </S.StopCountDownButton>
        ):(
          <S.StartCountDownButton disabled={isSubmitDesabled} type="submit">
            <Play />
            Começar
          </S.StartCountDownButton>
        )}
      </form>
    </S.HomeContainer>
  )
}
