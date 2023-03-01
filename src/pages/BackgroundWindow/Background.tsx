import { FC, useEffect } from 'react'

import { CONFIG_HOOKS, WINDOW_NAMES } from 'app/constants'
import { useWindow } from 'overwolf-hooks'
import { featuresById } from 'features/games'
import { useGameEventProvider } from 'hooks/useGameEventProvider'
import { useRunningGame } from 'hooks/useRunningGame'
import { registerAppLaunchTriggerHandler } from 'utils/registerAppLauchTriggerHandler'
import { useDispatch } from 'react-redux'
import { setHeaderData } from 'features/background/background-slice'

const { DESKTOP } = WINDOW_NAMES

const BackgroundWindow: FC = () => {
  const [currentGame] = useRunningGame()
  const [desktopWindow] = useWindow(DESKTOP, CONFIG_HOOKS)
  const { setRequiredFeatures } = useGameEventProvider()

  const dispatch = useDispatch()

  useEffect(() => {
    const gameResource = currentGame && featuresById.get(currentGame.id)
    if (
      gameResource &&
      (currentGame?.gameRunning || currentGame?.gameChanged)
    ) {
      dispatch(
        setHeaderData({
          timestamp: Date.now(),
          id: gameResource.id,
          title: gameResource.title,
          features: gameResource.features,
        }),
      )
    }
  }, [dispatch, currentGame])

  useEffect(() => {
    if (
      (currentGame?.gameRunning && currentGame.id) ||
      currentGame?.gameChanged
    ) {
      const gameResource = featuresById.get(currentGame.id)
      gameResource !== undefined &&
        gameResource?.features?.length > 0 &&
        setRequiredFeatures(gameResource.features, currentGame.id)
    }
  }, [currentGame, setRequiredFeatures])

  useEffect(() => {
    const shouldMinimize = currentGame?.gameRunning

    if (desktopWindow && shouldMinimize) {
      desktopWindow.minimize()
    } else if (
      desktopWindow &&
      (!shouldMinimize || currentGame === undefined)
    ) {
      desktopWindow?.restore()
    }
  }, [currentGame, desktopWindow])

  useEffect(registerAppLaunchTriggerHandler, [])

  return <></>
}

export { BackgroundWindow }
