import { useEffect, useState, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { setEvent, setInfo, sendDataContent } from 'features/background'
import {
  CONDITIONS_TO_FINNISH,
  CONDITIONS_TO_START,
  REGISTER_RETRY_TIMEOUT,
} from 'app/constants'

export const OVERWOLF = overwolf.games.events
export const useGameEventProvider = () => {
  const [isRunning, setRunning] = useState(false)
  const [alreadyFinished, setAlreadyFinished] = useState(false)
  const [requiredFeatures, setInternalRequiredFeatures] = useState<string[]>([])
  const [currentGame, setCurrentGame] = useState<number>(0)
  const dispatch = useDispatch()

  useEffect(() => {
    if (alreadyFinished) {
      dispatch(sendDataContent())
      setTimeout(() => {
        setAlreadyFinished(false)
      }, REGISTER_RETRY_TIMEOUT * 2)
    }
  }, [dispatch, alreadyFinished])

  const handleGameEvent = useCallback(
    ({ info, events }: { info?: any; events?: any[] }) => {
      info && dispatch(setInfo({ info }))
      events && dispatch(setEvent({ event: events }))

      const currentEvent = events?.[0]?.name

      CONDITIONS_TO_FINNISH.some((condition) => condition === currentEvent) &&
        setAlreadyFinished(true)

      CONDITIONS_TO_START.some((condition) => condition === currentEvent) &&
        setAlreadyFinished(false)
    },
    [dispatch],
  )

  useEffect(() => {
    if (isRunning)
      overwolf.games.events.getInfo((currentInfo) => {
        handleGameEvent({ info: currentInfo })
      })
  }, [isRunning, handleGameEvent])

  const registerToGepCallback = useCallback(
    async ({ status, ...rest }: { status: 'error' | 'success' }) => {
      OVERWOLF.onInfoUpdates2.removeListener(handleGameEvent)
      OVERWOLF.onNewEvents.removeListener(handleGameEvent)
      if (status === 'error') {
        setTimeout(() => {
          OVERWOLF.setRequiredFeatures(requiredFeatures, registerToGepCallback)
        }, REGISTER_RETRY_TIMEOUT)
      } else if (status === 'success') {
        OVERWOLF.onInfoUpdates2.addListener(handleGameEvent)
        OVERWOLF.onNewEvents.addListener(handleGameEvent)
        setRunning(true)
      }
      console.log(
        '[registerToGepCallback] ',
        JSON.stringify({ status, ...rest }, null, 2),
      )
    },
    [handleGameEvent, requiredFeatures],
  )

  const setRequiredFeatures = useCallback(
    (features: string[], game: number) => {
      if (game !== currentGame) {
        setInternalRequiredFeatures(features)
        setCurrentGame(game)
        setRunning(false)
        setAlreadyFinished(false)
      }
    },
    [currentGame],
  )

  const runGep = useCallback(() => {
    !isRunning &&
      requiredFeatures.length &&
      OVERWOLF.setRequiredFeatures(requiredFeatures, registerToGepCallback)
  }, [registerToGepCallback, requiredFeatures, isRunning])

  useEffect(runGep, [runGep])

  return { isRunning, setRequiredFeatures, requiredFeatures } as const
}
