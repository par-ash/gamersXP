import { useEffect, useState } from 'react'

export interface UseRunningGamePayload {
  gameRunning: boolean
  id: number
  title: string
  gameChanged: boolean
  isInFocus: boolean
}

interface IGameInfo {
  isInFocus: boolean
  isRunning: boolean
  allowsVideoCapture: boolean
  title: string
  id: number
  classId: number
  width: number
  height: number
  logicalWidth: number
  logicalHeight: number
  renderers: [string, string]
  detectedRenderer: string
  commandLine: string
  monitorHandle: Record<string, string>
  windowHandle: Record<string, number>
  processId: number
}

enum Reason {
  Game,
  Launcher,
}

interface OWGameRunningEvent {
  gameInfo: IGameInfo
  resolutionChanged: boolean
  focusChanged: boolean
  runningChanged: boolean
  gameChanged: boolean
  gameOverlayChanged: boolean
  overlayInputHookError: boolean
  reason: Reason
}

interface IgetRunningGameInfo extends IGameInfo {
  success: boolean
  error: string
}

export const useRunningGame = () => {
  const [game, setGame] = useState<UseRunningGamePayload>()

  function onGameInfoUpdated(payload: OWGameRunningEvent) {
    const gameRunning: UseRunningGamePayload = {
      gameRunning: payload?.gameInfo?.isRunning,
      id: Math.round((payload?.gameInfo?.id || 0) / 10),
      title: payload?.gameInfo?.title || '',
      gameChanged: payload?.gameChanged || false,
      isInFocus: payload?.focusChanged || false,
    }
    setGame(gameRunning)
  }

  function onGetRunningGameInfo(payload: IgetRunningGameInfo) {
    console.log('[onGetRunningGameInfo] ', JSON.stringify(payload, null, 2))
    setGame((currentGame) => ({
      gameChanged: currentGame?.gameChanged || false,
      id: Math.round((payload?.id || 0) / 10),
      title: payload?.title || '',
      gameRunning: payload?.isRunning ?? false,
      isInFocus: payload?.isInFocus ?? false,
    }))
  }

  useEffect(() => {
    overwolf.games.getRunningGameInfo(onGetRunningGameInfo)
    overwolf.games.onGameInfoUpdated.addListener(onGameInfoUpdated)

    return () => {
      overwolf.games.onGameInfoUpdated.removeListener(onGameInfoUpdated)
    }
  }, [])

  return [game] as const
}
