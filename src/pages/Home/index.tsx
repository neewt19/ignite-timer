import { HandPalm, Play } from 'phosphor-react'
import * as S from './styles'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { useContext } from 'react'
import { NewCycleForm } from './components/NewCycleForm'
import { CountDown } from './components/Countdown'
import { CycleContext } from '../../context/CycleContext'

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod
    .number()
    .min(5, 'tem que ser no minimo 5 min man')
    .max(60, 'tem que ter no maximo 60 min man'),
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

export function Home() {
  const { activeCycle, createNewCycle, interruptCurrentCycle } =
    useContext(CycleContext)
  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })

  const { handleSubmit, watch, reset } = newCycleForm

  function handleCreateNewCycle(data: NewCycleFormData) {
    createNewCycle(data)
    reset()
  }

  const task = watch('task')

  const isSubmitDesabled = !task

  return (
    <S.HomeContainer>
      <form action="" onSubmit={handleSubmit(handleCreateNewCycle)}>
        <FormProvider {...newCycleForm}>
          <NewCycleForm />
        </FormProvider>
        <CountDown />

        {activeCycle ? (
          <S.StopCountDownButton type="button" onClick={interruptCurrentCycle}>
            <HandPalm />
            Interromper
          </S.StopCountDownButton>
        ) : (
          <S.StartCountDownButton disabled={isSubmitDesabled} type="submit">
            <Play />
            Começar
          </S.StartCountDownButton>
        )}
      </form>
    </S.HomeContainer>
  )
}
