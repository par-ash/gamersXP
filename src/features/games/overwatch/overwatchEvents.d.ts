/**
 * Overwatch Available Features
 * @see https://overwolf.github.io/docs/api/overwolf-games-events-overwatch
 */

declare module Overwatch {
  type TfeatureID = 10844
  type Tname = 'Overwatch'
  type TshortName = 'OW'
  type TavailableFeatures = 'game_info' | 'match_info' | 'kill' | 'death'

  interface ImatchStartEvent {
    name: 'match_start'
    data: null
  }

  interface ImatchEndEvent {
    name: 'match_end'
    data: null
  }

  type TgameEvents = ImatchStartEvent | ImatchEndEvent

  interface IgameInfo {
    feature: TavailableFeatures
    match_info?: Record<string, any>
  }

  interface IJSON {
    id: TfeatureID | null | number
    title: Tname | null | string
    timestamp: number | null
    features: TavailableFeatures[] | string[]
    data: {
      events: {
        timestamp: number
        event: TgameEvents[]
      }[]
      infos: {
        timestamp: number
        info: IgameInfo
      }[]
    }
  }
}
